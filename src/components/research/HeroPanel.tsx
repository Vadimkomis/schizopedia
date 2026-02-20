import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function HeroPanel({
  lastUpdated,
  totalArticles,
  categoryCount,
  sourceLabel,
}: {
  lastUpdated: string;
  totalArticles: number;
  categoryCount: number;
  sourceLabel: string;
}) {
  return (
    <section className="glow-card rounded-[32px] border border-white bg-gradient-to-br from-white via-[#f5f8fc] to-white p-6 text-slate-900 shadow-[0_30px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:from-[#0d1420] dark:via-[#0a0f18] dark:to-[#05070d] dark:text-white sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Badge>Research Directory</Badge>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-white/60">
            {sourceLabel}
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm text-slate-500 dark:text-white/70">
            Updated weekly from PubMed
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            Schizopedia
          </h1>
          <p className="text-lg text-slate-600 dark:text-white/70">
            A clear guide to the latest schizophrenia research — covering how
            it's diagnosed, treated, and what can help prevent it. All articles
            are sourced from PubMed, a trusted medical research database.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatPill label="Last refresh" value={lastUpdated} />
          <StatPill label="Articles" value={totalArticles || "0"} />
          <StatPill label="Categories" value={`${categoryCount}`} />
        </div>
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-inner shadow-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
        {label}
      </p>
      <p className="mt-2 font-heading text-xl text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
