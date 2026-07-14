/**
 * The scene itself lives in a standalone SVG so it paints immediately, keeps
 * its tiny ambient loops independent from React, and remains crisp at every
 * viewport size. The SVG disables all motion for prefers-reduced-motion.
 */
export function BrainScene({ className }: { className?: string }) {
  return (
    <img
      src="/brain-aerial.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      width={800}
      height={620}
      className={className}
    />
  );
}
