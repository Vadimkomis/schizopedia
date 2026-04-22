import { Link } from "react-router-dom";
import { Activity, BookOpen, Brain, FlaskConical, LineChart } from "lucide-react";

export interface HeroSectionProps {
  researchProgress: number;
  totalArticles: number;
}

export function HeroSection({ researchProgress, totalArticles }: HeroSectionProps) {
  return (
    <section className="hero-band">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-20">
        <div className="max-w-xl space-y-6 fade-up">
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[54px]">
            Understand the Latest Research on Schizophrenia
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Explore the latest studies and discoveries in cure, diagnosis,
            prevention, and treatment research to build a better future for
            brain health.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/#highlights"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Explore Research
            </Link>
            <Link
              to="/#about"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-600 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:bg-transparent dark:text-brand-200 dark:hover:bg-brand-900/30"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Learn More
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
              <ProgressRing value={researchProgress} />
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Research Progress
              </div>
            </MetricCard>
          </div>
        </div>
      </div>

      <p className="sr-only">
        Schizopedia currently indexes {totalArticles} peer-reviewed articles.
      </p>
    </section>
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

function ProgressRing({ value }: { value: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#dbeafe"
          strokeWidth="4"
          className="dark:stroke-white/15"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="dark:stroke-brand-300"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-brand-700 dark:text-brand-200">
        {value}%
      </span>
    </div>
  );
}

function BrainIllustration() {
  return (
    <div className="relative mx-auto flex h-[320px] w-full max-w-[480px] items-center justify-center lg:h-[380px]">
      <div
        className="absolute inset-0 brain-glow blur-2xl opacity-80"
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full items-center justify-center">
        <Activity
          aria-hidden="true"
          className="h-52 w-52 text-brand-500/60 drop-shadow-[0_8px_30px_rgba(59,130,246,0.35)] dark:text-brand-300 lg:h-64 lg:w-64"
        />
        <NetworkNodes />
      </div>
    </div>
  );
}

function NetworkNodes() {
  const nodes = [
    { top: "10%", left: "18%", size: 6 },
    { top: "22%", left: "78%", size: 5 },
    { top: "60%", left: "8%", size: 5 },
    { top: "72%", left: "82%", size: 7 },
    { top: "84%", left: "32%", size: 4 },
    { top: "34%", left: "50%", size: 5 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {nodes.map((n, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-brand-500 shadow-[0_0_14px_rgba(59,130,246,0.6)] dark:bg-brand-300"
          style={{
            top: n.top,
            left: n.left,
            width: n.size,
            height: n.size,
          }}
        />
      ))}
    </div>
  );
}
