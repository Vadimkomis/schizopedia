/**
 * Hero illustration: a human head in profile with a glowing neural-network
 * brain. Served as an optimized WebP (with a JPG fallback) and framed so it
 * sits cleanly on both the light and dark hero grounds. It is the likely LCP
 * element, so it loads eagerly at high priority.
 */
export function BrainIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div
        className="absolute -inset-6 brain-glow blur-3xl opacity-60"
        aria-hidden="true"
      />
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
          className="relative w-full rounded-[28px] object-cover shadow-[0_20px_60px_-15px_rgba(37,99,235,0.45)] ring-1 ring-slate-900/10 dark:ring-white/10"
        />
      </picture>
    </div>
  );
}
