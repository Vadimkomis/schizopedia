import { buildArticleMeta, formatActionability, formatEvidenceLevel } from "@/lib/format";
import type { ResearchArticle } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ArticleCard({ article }: { article: ResearchArticle }) {
  return (
    <li className="group rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-[#0f172a] dark:text-white/80 dark:hover:border-white/20">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-start gap-3 text-left"
      >
        <span
          className="mt-1 block h-2 w-2 rounded-full bg-blue-500"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-300/30 dark:bg-blue-400/10 dark:text-blue-200">
              {formatEvidenceLevel(article.evidenceLevel)}
            </Badge>
            {article.studyType && (
              <Badge
                variant="outline"
                className="border-slate-300/70 text-slate-600 dark:border-white/20 dark:text-white/80"
              >
                {article.studyType}
              </Badge>
            )}
          </div>
          <p className="font-heading text-lg text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-200">
            {article.title}
          </p>
          <p className="text-sm text-slate-600 dark:text-white/70">
            {buildArticleMeta(article)}
          </p>
          <p className="text-sm text-slate-500 dark:text-white/60">
            {article.snippet ?? "View full article on PubMed"}
          </p>
          <p className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            {formatActionability(article.actionability)}
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700 dark:text-white/60 dark:group-hover:text-blue-200" />
      </a>
    </li>
  );
}
