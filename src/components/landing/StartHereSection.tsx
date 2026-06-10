import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Eye,
  HeartHandshake,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { GUIDES } from "@/lib/guides";

const GUIDE_ICONS: Record<string, LucideIcon> = {
  "what-is-schizophrenia": BookOpen,
  "early-warning-signs": Eye,
  "getting-help": Compass,
  "treatment-explained": Stethoscope,
  "caring-for-yourself": HeartHandshake,
};

export function StartHereSection() {
  return (
    <section
      id="start-here"
      aria-labelledby="start-here-heading"
      className="container py-14 lg:py-16 scroll-mt-20"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
          Start here
        </p>
        <h2
          id="start-here-heading"
          className="mt-2 font-heading text-3xl font-semibold text-slate-900 dark:text-white"
        >
          New to all of this? You&apos;re in the right place.
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Five short guides written for families and friends — no scientific
          background needed. Read them in order, or jump to the one you need
          tonight.
        </p>
      </div>

      <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide, index) => {
          const Icon = GUIDE_ICONS[guide.id] ?? BookOpen;
          return (
            <li key={guide.id} className="h-full">
              <Link
                to={`/guide/${guide.id}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-brand-300/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full tint-sky">
                    <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                    Guide {index + 1} · {guide.readingMinutes} min read
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {guide.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-700 dark:text-brand-300">
                  Read guide
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
