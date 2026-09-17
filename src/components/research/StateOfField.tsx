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
      className="rounded-2xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent dark:text-accent-dark">
        Where things stand
      </p>
      <h2
        id="state-of-field-heading"
        className="mt-2 font-heading text-2xl font-semibold text-ink dark:text-ink-inverse sm:text-3xl"
      >
        The state of the research right now
      </h2>
      <div className="mt-4 space-y-4 text-ink-muted dark:text-ink-muted-dark">
        {paragraphs.map((text, i) => (
          <p key={i} className="leading-relaxed">
            {text}
          </p>
        ))}
      </div>

      {citations.length > 0 && (
        <div className="mt-6 border-t border-line pt-5 dark:border-line-dark">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted dark:text-ink-muted-dark">
            Documented by
          </h3>
          <ul className="mt-3 space-y-2">
            {citations.map((article) => (
              <li key={article.id}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-start gap-2 text-sm text-ink-muted hover:text-accent dark:text-ink-muted-dark dark:hover:text-accent-dark"
                >
                  <ExternalLink
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted group-hover:text-accent dark:text-ink-muted-dark dark:group-hover:text-accent-dark"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-medium">{article.title}</span>
                    <span className="text-ink-muted dark:text-ink-muted-dark">
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
