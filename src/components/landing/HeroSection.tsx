import { Link } from "react-router-dom";
import { BookOpen, Brain, FlaskConical, LineChart } from "lucide-react";
import { BrainIllustration } from "@/components/landing/BrainIllustration";
import { formatDateTime } from "@/lib/format";

export interface HeroSectionProps {
  totalArticles: number;
  lastUpdated?: string | null;
}

export function HeroSection({ totalArticles, lastUpdated }: HeroSectionProps) {
  return (
    <section className="hero-band">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div className="max-w-xl space-y-6 fade-up">
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[54px]">
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

        <div className="relative fade-up">
          <BrainIllustration />
          <div className="absolute inset-y-0 right-0 hidden flex-col justify-between gap-3 lg:flex">
            <MetricCard>
              <Brain className="h-6 w-6 text-brand-700 dark:text-brand-200" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="block h-1.5 w-10 rounded-full bg-slate-200 dark:bg-white/15" />
                <span className="block h-1.5 w-8 rounded-full bg-slate-200 dark:bg-white/15" />
                <span className="block h-1.5 w-6 rounded-full bg-slate-200 dark:bg-white/15" />
              </div>
            </MetricCard>

            <MetricCard>
              <LineChart className="h-6 w-6 text-brand-700 dark:text-brand-200" aria-hidden="true" />
              <TrendSpark />
            </MetricCard>

            <MetricCard>
              <span className="font-heading text-2xl font-semibold text-brand-700 dark:text-brand-200">
                {totalArticles}
              </span>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Peer-reviewed studies indexed
              </div>
            </MetricCard>
          </div>
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

function MetricCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-[168px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-card backdrop-blur dark:border-white/10 dark:bg-white/5">
      {children}
    </div>
  );
}

function TrendSpark() {
  return (
    <svg viewBox="0 0 90 36" className="h-7 w-[92px] text-brand-600 dark:text-brand-300" aria-hidden="true">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="2,30 14,26 26,28 38,18 50,22 62,12 74,14 88,4"
      />
      <circle cx="88" cy="4" r="2.5" fill="currentColor" />
    </svg>
  );
}
