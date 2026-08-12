import { ExternalLink } from "lucide-react";
import { formatPublishedShort } from "@/lib/dates";
import type { EvidenceMatch } from "@/lib/evidenceSearch";

export function EvidenceCitationList({ matches }: { matches: EvidenceMatch[] }) {
  if (matches.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-ink dark:text-ink-inverse">Sources</h3>
      <ol className="mt-3 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
        {matches.map(({ article }, index) => {
          const metadata = [
            article.journal,
            article.studyType,
            formatPublishedShort(article.published),
          ].filter((value): value is string => Boolean(value));

          return (
            <li key={article.id} className="flex gap-3 py-4">
              <span className="text-sm font-semibold tabular-nums text-ink-muted dark:text-ink-muted-dark">
                {index + 1}
              </span>
              <div className="min-w-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-1.5 font-medium text-accent hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
                >
                  <span>{article.title}</span>
                  <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
                {metadata.length > 0 && (
                  <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
                    {metadata.join(" · ")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
