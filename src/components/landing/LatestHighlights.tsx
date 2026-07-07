import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical } from "lucide-react";
import { TEXT_ACTION_LINK_CLASS } from "@/lib/styles";
import { formatPublishedShort, publishedTimestamp } from "@/lib/dates";
import type { ResearchCategory } from "@/lib/types";
import { HighlightCard } from "./HighlightCard";

// Re-exported for backwards compatibility with existing imports/tests.
export { formatPublishedShort };

const VARIANTS = ["neuro", "scan", "lab"] as const;
type Variant = (typeof VARIANTS)[number];

export interface LatestHighlightsProps {
  categories: ResearchCategory[];
  loading: boolean;
}

export function LatestHighlights({ categories, loading }: LatestHighlightsProps) {
  const picks = pickHighlights(categories, 3);

  return (
    <section id="highlights" className="container py-16 lg:py-20 scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full tint-sky">
            <FlaskConical className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
            Latest Research Highlights
          </h2>
        </div>
        <Link
          to="/category/diagnosis"
          className={TEXT_ACTION_LINK_CLASS}
        >
          View all research
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && picks.length === 0
          ? Array.from({ length: 3 }).map((_, i) => <HighlightSkeleton key={i} />)
          : picks.length === 0
            ? (
              <p className="col-span-full text-sm text-slate-500 dark:text-slate-400">
                No articles available yet. Check back after the next refresh.
              </p>
            )
            : picks.map((pick, i) => (
                <HighlightCard
                  key={pick.article.id}
                  article={pick.article}
                  category={pick.category}
                  dateLabel={pick.dateLabel}
                  variant={VARIANTS[i] as Variant}
                />
              ))}
      </div>
    </section>
  );
}

function HighlightSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0f172a]">
      <div className="h-44 bg-slate-100 dark:bg-white/5" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-white/15" />
        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-white/10" />
      </div>
    </div>
  );
}

interface Pick {
  article: ResearchCategory["articles"][number];
  category: { id: string; title: string };
  dateLabel: string;
  sortKey: number;
}

function pickHighlights(categories: ResearchCategory[], count: number): Pick[] {
  const all: Pick[] = [];
  categories.forEach((category) => {
    (category.articles ?? []).forEach((article) => {
      all.push({
        article,
        category: { id: category.id, title: category.title },
        dateLabel: formatPublishedShort(article.published) ?? "Recent",
        sortKey: publishedTimestamp(article.published),
      });
    });
  });
  all.sort((a, b) => b.sortKey - a.sortKey);
  return all.slice(0, count);
}
