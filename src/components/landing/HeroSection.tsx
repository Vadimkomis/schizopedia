import { Link } from "react-router-dom";
import { BookOpen, FlaskConical } from "lucide-react";
import { BrainIllustration } from "@/components/landing/BrainIllustration";
import { formatDateTime } from "@/lib/format";

export interface HeroSectionProps {
  totalArticles: number;
  lastUpdated?: string | null;
}

export function HeroSection({ totalArticles, lastUpdated }: HeroSectionProps) {
  return (
    <section className="hero-band overflow-hidden">
      <div className="container grid items-center gap-9 py-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8 lg:py-16 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="relative z-10 max-w-xl space-y-6 fade-up lg:py-4 xl:py-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 shadow-sm backdrop-blur dark:border-brand-300/20 dark:bg-white/5 dark:text-brand-200">
            Clarity through evidence
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[48px] xl:text-[54px]">
            When schizophrenia touches someone you love, start here.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Plain-language guides and the latest peer-reviewed research —
            written for caregivers, families, and friends. No scientific
            background needed.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/#start-here"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Start Here
            </Link>
            <Link
              to="/#highlights"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-transparent dark:text-brand-200 dark:hover:bg-brand-900/30"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Explore Research
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center fade-up lg:justify-end">
          <BrainIllustration />
        </div>
      </div>

      <HeroStats totalArticles={totalArticles} lastUpdated={lastUpdated} />
    </section>
  );
}

function HeroStats({ totalArticles, lastUpdated }: HeroSectionProps) {
  return (
    <dl className="container grid grid-cols-2 gap-6 border-t border-slate-200/70 py-8 dark:border-white/10 md:grid-cols-4">
      <StatItem
        value={String(totalArticles)}
        label="Peer-reviewed studies indexed"
      />
      <StatItem value="Weekly" label="Automatic PubMed refresh" />
      <StatItem value="100%" label="Linked to primary sources" />
      <StatItem
        value={lastUpdated ? formatDateTime(lastUpdated) : "Pending sync…"}
        label="Last refreshed"
        compact
      />
    </dl>
  );
}

function StatItem({
  value,
  label,
  compact = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="order-2 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`order-1 font-heading font-semibold text-slate-900 dark:text-white ${
          compact ? "text-base" : "text-3xl"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
