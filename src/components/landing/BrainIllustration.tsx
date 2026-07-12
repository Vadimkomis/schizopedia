import { lazy, Suspense } from "react";

// The animated canvas is code-split and only loads after the page is
// interactive, so it never blocks first paint. The static image below paints
// instantly (the LCP element) and is the reduced-motion / no-JS fallback.
const BrainScene = lazy(() =>
  import("@/components/landing/BrainScene").then((m) => ({
    default: m.BrainScene,
  })),
);

/**
 * Hero visual: a rotating 3D neural-network brain. A framed dark stage holds a
 * static poster image (instant paint) with the live animation layered on top.
 */
export function BrainIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div
        className="absolute -inset-6 brain-glow blur-3xl opacity-60"
        aria-hidden="true"
      />
      <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#05080f] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.45)] ring-1 ring-slate-900/10 dark:ring-white/10">
        <picture>
          <source srcSet="/hero-brain.webp" type="image/webp" />
          <img
            src="/hero-brain.jpg"
            alt="A human head in profile with a glowing, multicoloured neural network illustrating the brain"
            width={1000}
            height={1000}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <Suspense fallback={null}>
          <BrainScene className="absolute inset-0 h-full w-full" />
        </Suspense>
      </div>
    </div>
  );
}
