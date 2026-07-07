import type { LucideIcon } from "lucide-react";
import { ArticleCard } from "@/components/research/ArticleCard";
import type { ResearchArticle } from "@/lib/types";

export interface ResearchSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  articles: ResearchArticle[];
  emptyLabel: string;
}

/** A titled list of article cards — used for "Most important" and "Latest". */
export function ResearchSection({
  id,
  icon: Icon,
  title,
  description,
  articles,
  emptyLabel,
}: ResearchSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className="scroll-mt-20">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full tint-sky">
          <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
        </span>
        <div>
          <h2
            id={headingId}
            className="font-heading text-2xl font-semibold text-slate-900 dark:text-white"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
      </div>

      {articles.length > 0 ? (
        <ol className="mt-6 space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {emptyLabel}
        </p>
      )}
    </section>
  );
}
