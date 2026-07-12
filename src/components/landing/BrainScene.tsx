import { useEffect, useRef } from "react";
import { generateBrainField } from "@/components/landing/brainField";

/**
 * A rotating 3D brain rendered on a 2D canvas: a warped point cloud drawn as
 * additive glowing dots, with brighter pulsing "neurons" and connective
 * fibers. No 3D library — points are rotated and perspective-projected by
 * hand, which keeps it tiny and dependency-free.
 *
 * The animation pauses when off-screen or the tab is hidden, and falls back to
 * a single static frame when the visitor prefers reduced motion.
 */

// Palette per color index: [core, cyan, violet] as glowing sprite colours.
const PALETTE = [
  { r: 210, g: 232, b: 255 },
  { r: 120, g: 210, b: 255 },
  { r: 180, g: 170, b: 255 },
];

function makeSprite(color: { r: number; g: number; b: number }): HTMLCanvasElement {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(255,255,255,0.95)`);
  g.addColorStop(0.25, `rgba(${color.r},${color.g},${color.b},0.85)`);
  g.addColorStop(0.6, `rgba(${color.r},${color.g},${color.b},0.28)`);
  g.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export function BrainScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reduced motion: leave the canvas transparent so the static image poster
    // beneath it stays visible, and do no work.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const field = generateBrainField({ cortexPoints: mobile ? 1500 : 2600 });
    const sprites = PALETTE.map(makeSprite);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let bg: CanvasGradient | null = null;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const g = ctx.createRadialGradient(
        width * 0.5, height * 0.46, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.72,
      );
      g.addColorStop(0, "#0b1630");
      g.addColorStop(0.55, "#070c1c");
      g.addColorStop(1, "#04060e");
      bg = g;
    };
    resize();

    const { positions, sizes, colors, phases, neurons, links, count } = field;
    const rx = new Float32Array(count);
    const ry = new Float32Array(count);
    const rz = new Float32Array(count);

    const TILT = 0.32;
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    const CAM = 3.2;
    const FOCAL = 2.15;

    let yaw = -0.5;
    let raf = 0;
    let last = 0;
    let running = false;

    const draw = (dtSeconds: number, timeSeconds: number) => {
      yaw += dtSeconds * 0.45;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const scale = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bg ?? "#04060e";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // Rotate + project every point.
      for (let i = 0; i < count; i += 1) {
        const x0 = positions[i * 3];
        const y0 = positions[i * 3 + 1];
        const z0 = positions[i * 3 + 2];
        // Yaw around vertical axis.
        const xz = x0 * cosY - z0 * sinY;
        const zz = x0 * sinY + z0 * cosY;
        // Tilt around horizontal axis.
        const yz = y0 * cosT - zz * sinT;
        const zt = y0 * sinT + zz * cosT;
        const persp = FOCAL / (CAM - zt);
        rx[i] = cx + xz * persp * scale;
        ry[i] = cy - yz * persp * scale;
        rz[i] = persp; // depth cue: larger persp = nearer
      }

      // Fibers first, faint, behind the nodes.
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(120,200,255,0.14)";
      ctx.beginPath();
      for (let l = 0; l < links.length; l += 2) {
        const a = links[l];
        const b = links[l + 1];
        ctx.moveTo(rx[a], ry[a]);
        ctx.lineTo(rx[b], ry[b]);
      }
      ctx.stroke();

      // All points as additive sprites.
      for (let i = 0; i < count; i += 1) {
        const persp = rz[i];
        const depth = (persp - 0.5) / 0.7; // ~0..1 near→far normaliser
        const base = 0.35 + 0.65 * Math.max(0, Math.min(1, depth));
        const twinkle = 0.75 + 0.25 * Math.sin(timeSeconds * 2 + phases[i]);
        const alpha = base * twinkle;
        const s = sizes[i] * persp * scale * 0.05;
        const sprite = sprites[colors[i]];
        const d = s * 2;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.drawImage(sprite, rx[i] - s, ry[i] - s, d, d);
      }

      // Neuron sparkles on top: occasional bright flashes.
      for (let n = 0; n < neurons.length; n += 1) {
        const i = neurons[n];
        const pulse = Math.sin(timeSeconds * 3 + phases[i]);
        if (pulse < 0.6) continue;
        const persp = rz[i];
        const s = sizes[i] * persp * scale * 0.09 * (pulse - 0.6) * 2.5;
        ctx.globalAlpha = (pulse - 0.6) * 2.5;
        const d = s * 2;
        ctx.drawImage(sprites[0], rx[i] - s, ry[i] - s, d, d);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      draw(dt, now / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    // Render one frame immediately (also the only frame for reduced motion).
    draw(0, 0);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      resize();
      draw(0, last / 1000);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
