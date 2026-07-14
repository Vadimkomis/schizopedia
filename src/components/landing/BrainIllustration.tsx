import { BrainScene } from "@/components/landing/BrainScene";

/**
 * A calm, aerial brain diorama inspired by a monochrome architectural model.
 * The organ stays monumental and nearly still while tiny research signals,
 * beacons, and a pair of miniature rotors keep the landscape alive.
 */
export function BrainIllustration() {
  return (
    <figure
      className="relative mx-auto w-full max-w-[600px] xl:max-w-[680px]"
      role="img"
      aria-labelledby="brain-landscape-caption"
    >
      <div
        className="brain-glow absolute -inset-8 opacity-70 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-white/80 bg-[#eef2f5] shadow-[0_26px_70px_-34px_rgba(45,55,72,0.58)] ring-1 ring-slate-900/[0.04] dark:border-white/10 dark:ring-white/10">
        <BrainScene className="absolute inset-0 h-full w-full select-none object-cover dark:brightness-[0.76] dark:saturate-[0.85]" />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5"
          aria-hidden="true"
        >
          <p className="rounded-full border border-white/90 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur-sm sm:text-[11px]">
            The brain, mapped
          </p>
          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
        </div>

        <div
          className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/85 px-3 py-2.5 text-slate-700 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.65)] backdrop-blur-sm sm:bottom-5 sm:right-5 sm:px-4 sm:py-3"
          aria-hidden="true"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-50 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          </span>
          <span className="text-[11px] font-semibold sm:text-xs">
            Evidence in motion
          </span>
        </div>
      </div>

      <figcaption id="brain-landscape-caption" className="sr-only">
        An aerial, isometric brain rendered as a pale knowledge landscape with
        softly moving research signals.
      </figcaption>
    </figure>
  );
}
