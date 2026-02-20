import { buildArticleMeta } from "@/lib/format";
import type { ResearchArticle } from "@/lib/types";
import { ExternalLink } from "lucide-react";

export function ArticleCard({ article }: { article: ResearchArticle }) {
  return (
    <li className="group rounded-2xl border border-slate-200 bg-white/90 p-4 text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:text-white/80 dark:hover:border-white/40 dark:hover:bg-slate-900/80">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-start gap-3 text-left"
      >
        <span
          className="mt-1 block h-2 w-2 rounded-full bg-emerald-400"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p className="font-heading text-lg text-slate-900 group-hover:text-emerald-500 dark:text-white dark:group-hover:text-emerald-200">
            {article.title}
          </p>
          <p className="text-sm text-slate-600 dark:text-white/70">
            {buildArticleMeta(article)}
          </p>
          <p className="text-sm text-slate-500 dark:text-white/60">
            {article.snippet ?? "View full article on PubMed"}
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 dark:text-white/60 dark:group-hover:text-white" />
      </a>
    </li>
  );
}
