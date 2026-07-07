import { ExternalLink } from "lucide-react";
import { formatAuthors } from "@/lib/format";
import { formatPublishedShort } from "@/lib/dates";
import type { ResearchArticle } from "@/lib/types";

export interface StateOfFieldProps {
  paragraphs: string[];
  citations: ResearchArticle[];
}

/**
 * "Where things stand right now" — the plain-language summary of a category,
 * followed by the specific studies that document it.
 */
export function StateOfField({ paragraphs, citations }: StateOfFieldProps) {
  return (
    <section
      aria-labelledby="state-of-field-heading"
      className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#0f172a] sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
        Where things stand
      </p>
      <h2
        id="state-of-field-heading"
        className="mt-2 font-heading text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl"
      >
        The state of the research right now
      </h2>
      <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
        {paragraphs.map((text, i) => (
          <p key={i} className="leading-relaxed">
            {text}
          </p>
        ))}
      </div>

      {citations.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Documented by
          </h3>
          <ul className="mt-3 space-y-2">
            {citations.map((article) => (
              <li key={article.id}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-start gap-2 text-sm text-slate-700 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-200"
                >
                  <ExternalLink
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-brand-700 dark:group-hover:text-brand-200"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-medium">{article.title}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {" — "}
                      {formatAuthors(article.authors)}
                      {article.journal ? `, ${article.journal}` : ""}
                      {article.published
                        ? ` (${formatPublishedShort(article.published)})`
                        : ""}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
