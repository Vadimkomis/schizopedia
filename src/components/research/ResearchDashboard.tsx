import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { buildArticleMeta, formatDateTime } from "@/lib/format";
import type {
  ResearchArticle,
  ResearchCategory,
  ResearchPayload,
  ResearchSource,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const FALLBACK_CATEGORIES: ResearchCategory[] = [
  {
    id: "diagnosis",
    title: "Diagnosis",
    summary:
      "Early detection signals, imaging markers, and prodromal screening protocols.",
    articles: [],
  },
  {
    id: "treatment",
    title: "Treatment",
    summary: "Medication pipelines, psychosocial therapies, and digital care.",
    articles: [],
  },
  {
    id: "prevention",
    title: "Prevention",
    summary: "Risk-reduction frameworks and community-driven resilience.",
    articles: [],
  },
];

const HERO_METRICS = [
  {
    id: "signal",
    label: "Signal Quality",
    value: "92%",
    delta: "+4.1%",
    icon: Sparkles,
  },
  {
    id: "trials",
    label: "Live Trials",
    value: "64",
    delta: "+12",
    icon: Activity,
  },
  {
    id: "guard",
    label: "Prevention Focus",
    value: "3 tracks",
    delta: "new insights",
    icon: ShieldCheck,
  },
];

const CATEGORY_ACCENTS: Record<
  string,
  { light: string; dark: string }
> = {
  diagnosis: {
    light: "from-sky-100/80 via-white to-white",
    dark: "dark:from-sky-500/40 dark:to-sky-800/10",
  },
  treatment: {
    light: "from-fuchsia-100/70 via-white to-white",
    dark: "dark:from-fuchsia-500/40 dark:to-fuchsia-800/10",
  },
  prevention: {
    light: "from-emerald-100/70 via-white to-white",
    dark: "dark:from-emerald-400/40 dark:to-emerald-800/10",
  },
};

const DEFAULT_ACCENT = {
  light: "from-slate-100 via-white to-white",
  dark: "dark:from-slate-900/60 dark:to-slate-900/20",
};

const DEFAULT_SOURCES: ResearchSource[] = [
  {
    name: "PubMed (NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    description: "Peer-reviewed medical literature",
  },
];

export interface ResearchDashboardProps {
  data: ResearchPayload | null;
  loading: boolean;
  error: string | null;
}

export function ResearchDashboard({
  data,
  loading,
  error,
}: ResearchDashboardProps) {
  const categories = data?.categories?.length
    ? data.categories
    : FALLBACK_CATEGORIES;
  const sources = data?.sources?.length ? data.sources : DEFAULT_SOURCES;
  const totalArticles = data?.categories?.reduce(
    (sum, category) => sum + (category.articles?.length ?? 0),
    0,
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <div className="grid-overlay" />
      <div className="absolute inset-0 -z-10 bg-grid-glow blur-3xl opacity-70 dark:opacity-80" />
      <div className="container relative z-10 space-y-10 py-10 lg:py-16">
        <HeroPanel
          lastUpdated={formatDateTime(data?.lastUpdated)}
          totalArticles={totalArticles ?? 0}
          categoryCount={data?.categories?.length ?? FALLBACK_CATEGORIES.length}
          sourceLabel={sources.map((source) => source.name).join(", ")}
        />

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </p>
        )}

        <section
          aria-busy={loading}
          aria-live="polite"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              accent={CATEGORY_ACCENTS[category.id] ?? DEFAULT_ACCENT}
              index={index}
              loading={loading}
            />
          ))}
        </section>

        <SourcesPanel sources={sources} />
      </div>
    </div>
  );
}

function HeroPanel({
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
    <section className="glow-card rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-rose-50 to-sky-50 p-6 text-slate-900 shadow-[0_30px_60px_rgba(15,23,42,0.15)] dark:border-white/10 dark:from-slate-900/80 dark:via-indigo-900/60 dark:to-slate-900/30 dark:text-white sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Badge>Weekly Intelligence</Badge>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-white/60">
            {sourceLabel}
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm text-slate-500 dark:text-white/70">
            Auto-synced every Monday
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl">
            Schizopedia
          </h1>
          <p className="text-lg text-slate-600 dark:text-white/70">
            High-signal schizophrenia research distilled into diagnosis,
            treatment, and prevention tracks. Designed for neuro-focused care
            teams chasing clarity over noise.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatPill label="Last refresh" value={lastUpdated} />
          <StatPill label="Peer-reviewed entries" value={totalArticles || "0"} />
          <StatPill label="Focus tracks" value={`${categoryCount}`} />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {HERO_METRICS.map((metric) => (
          <MiniMetric key={metric.id} {...metric} />
        ))}
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-600 shadow-inner shadow-rose-100/80 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
        {label}
      </p>
      <p className="mt-2 font-heading text-xl text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  delta,
  icon: Icon,
}: (typeof HERO_METRICS)[number]) {
  return (
    <div className="rounded-3xl border border-rose-100/70 bg-white px-4 py-4 text-slate-600 shadow-inner shadow-rose-100/60 backdrop-blur dark:border-white/5 dark:bg-white/5 dark:text-white/80">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-2 text-rose-500 dark:border-white/10 dark:bg-white/10 dark:text-white/80">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
          {delta}
        </span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-white/60">
        {label}
      </p>
      <p className="font-heading text-2xl text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function CategoryCard({
  category,
  accent,
  loading,
  index,
}: {
  category: ResearchCategory;
  accent: { light: string; dark: string };
  loading: boolean;
  index: number;
}) {
  const hasArticles = category.articles?.length > 0;
  return (
    <Card
      className={cn(
        "glow-card h-full border-transparent bg-gradient-to-br from-white/90 via-white to-white p-0 dark:from-slate-900/60 dark:via-slate-900/30 dark:to-slate-900/10",
        "bg-gradient-to-br",
        accent.light,
        accent.dark,
      )}
    >
      <CardHeader className="border-b border-slate-100 px-6 pb-6 pt-6 dark:border-white/5">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{category.title}</Badge>
          <span className="text-xs uppercase tracking-[0.4em] text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <CardTitle className="text-2xl text-slate-900 dark:text-white">
          {category.summary}
        </CardTitle>
        <CardDescription className="text-base text-slate-600 dark:text-white/80">
          {hasArticles
            ? `${category.articles.length} highlighted studies`
            : "Awaiting the next PubMed sync"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        {loading && !hasArticles ? (
          <SkeletonList />
        ) : hasArticles ? (
          <ScrollArea className="h-[360px] pr-2">
            <ol className="space-y-4">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </ol>
          </ScrollArea>
        ) : (
          <p className="text-sm text-slate-600 dark:text-white/70">
            No fresh research surfaced this cycle—check back after the next
            refresh.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ArticleCard({ article }: { article: ResearchArticle }) {
  return (
    <li className="group rounded-2xl border border-slate-200 bg-white/90 p-4 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:text-white/80 dark:hover:border-white/40 dark:hover:bg-slate-900/80">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-start gap-3 text-left"
      >
        <span className="mt-1 block h-2 w-2 rounded-full bg-emerald-400" />
        <div className="space-y-1">
          <p className="font-heading text-lg text-slate-900 group-hover:text-emerald-500 dark:text-white dark:group-hover:text-emerald-200">
            {article.title}
          </p>
          <p className="text-sm text-slate-600 dark:text-white/70">
            {buildArticleMeta(article)}
          </p>
          <p className="text-sm text-slate-500 dark:text-white/60">
            {article.snippet ?? "View abstract on PubMed"}
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:text-white/60 dark:group-hover:text-white" />
      </a>
    </li>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5"
        >
          <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-white/20" />
          <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-100 dark:bg-white/10" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-100 dark:bg-white/5" />
        </div>
      ))}
    </div>
  );
}

function SourcesPanel({ sources }: { sources: ResearchSource[] }) {
  return (
    <Card className="glow-card border-white/70 bg-white/90 dark:border-white/10 dark:bg-slate-900/70">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
          <div>
            <CardTitle className="text-2xl text-slate-900 dark:text-white">
              Source fidelity
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-white/80">
              Research is fetched directly from verified NIH feeds.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="gap-4">
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.name}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {source.name}
                </p>
                {source.description && (
                  <p className="text-slate-600 dark:text-white/70">
                    {source.description}
                  </p>
                )}
              </div>
              <a
                className="ml-auto text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit source
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
