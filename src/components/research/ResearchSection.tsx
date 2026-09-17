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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-accent dark:bg-surface-dark-subtle dark:text-accent-dark">
          <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
        </span>
        <div>
          <h2
            id={headingId}
            className="font-heading text-2xl font-semibold text-ink dark:text-ink-inverse"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
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
        <p className="mt-6 rounded-xl border border-line bg-surface-subtle px-6 py-4 text-sm text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark">
          {emptyLabel}
        </p>
      )}
    </section>
  );
}
