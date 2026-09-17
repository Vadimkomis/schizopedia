import { buildArticleMeta, formatActionability, formatEvidenceLevel } from "@/lib/format";
import type { ResearchArticle } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ArticleCard({ article }: { article: ResearchArticle }) {
  return (
    <li className="group rounded-xl border border-line bg-surface p-4 text-ink-muted transition hover:border-accent/40 dark:border-line-dark dark:bg-surface-dark dark:text-ink-muted-dark dark:hover:border-accent-dark/50">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-start gap-3 text-left"
      >
        <span
          className="mt-1 block h-2 w-2 rounded-full bg-accent dark:bg-accent-dark"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-brand-200 bg-brand-50 text-accent dark:border-brand-300/30 dark:bg-brand-400/10 dark:text-accent-dark">
              {formatEvidenceLevel(article.evidenceLevel)}
            </Badge>
            {article.studyType && (
              <Badge
                variant="outline"
                className="border-line text-ink-muted dark:border-line-dark dark:text-ink-muted-dark"
              >
                {article.studyType}
              </Badge>
            )}
          </div>
          <p className="font-heading text-lg text-ink group-hover:text-accent dark:text-ink-inverse dark:group-hover:text-accent-dark">
            {article.title}
          </p>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            {buildArticleMeta(article)}
          </p>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            {article.snippet ?? "View full article on PubMed"}
          </p>
          <p className="rounded-xl border border-line bg-surface-subtle px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark">
            {formatActionability(article.actionability)}
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-ink-muted group-hover:text-accent dark:text-ink-muted-dark dark:group-hover:text-accent-dark" />
      </a>
    </li>
  );
}
