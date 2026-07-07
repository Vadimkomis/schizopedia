import { ArrowRight, FlaskConical, ScanLine, TestTube } from "lucide-react";
import { TEXT_ACTION_LINK_CLASS } from "@/lib/styles";
import type { ResearchArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface HighlightCardProps {
  article: ResearchArticle;
  category: { id: string; title: string };
  dateLabel: string;
  variant: "neuro" | "scan" | "lab";
}

const variantClass: Record<HighlightCardProps["variant"], string> = {
  neuro: "highlight-gradient-neuro",
  scan: "highlight-gradient-scan",
  lab: "highlight-gradient-lab",
};

const variantIcon: Record<HighlightCardProps["variant"], typeof FlaskConical> = {
  neuro: FlaskConical,
  scan: ScanLine,
  lab: TestTube,
};

const variantLabel: Record<HighlightCardProps["variant"], string> = {
  neuro: "Neuroscience",
  scan: "Imaging",
  lab: "Biomarkers",
};

export function HighlightCard({
  article,
  category,
  dateLabel,
  variant,
}: HighlightCardProps) {
  const Icon = variantIcon[variant];
  const snippet = article.snippet?.slice(0, 160);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-white/10 dark:bg-[#0f172a]">
      <div
        className={cn(
          "relative flex h-44 items-center justify-center",
          variantClass[variant],
        )}
      >
        <Icon
          className="h-16 w-16 text-white/85 drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            {variantLabel[variant]}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dateLabel}
          </span>
        </div>

        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-slate-900 dark:text-white">
          {article.title}
        </h3>

        {snippet && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {snippet}
            {article.snippet && article.snippet.length > 160 ? "…" : ""}
          </p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer noopener"
          className={cn("mt-auto pt-4", TEXT_ACTION_LINK_CLASS)}
          aria-label={`Read summary of ${article.title} (${category.title})`}
        >
          Read summary
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}
