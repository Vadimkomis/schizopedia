import { formatPublishedShort, publishedTimestamp } from "@/lib/dates";
import type { ResearchCategory } from "@/lib/types";

export { formatPublishedShort };

export interface LatestHighlightsProps {
  categories: ResearchCategory[];
  loading: boolean;
}

export function LatestHighlights({ categories, loading }: LatestHighlightsProps) {
  const picks = pickHighlights(categories, 3);

  return (
    <section id="latest" aria-labelledby="latest-heading" className="container py-12 lg:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">
        Updated weekly
      </p>
      <h2 id="latest-heading" className="mt-1 font-heading text-2xl font-semibold text-ink dark:text-ink-inverse sm:text-3xl">
        Latest studies
      </h2>

      {loading && picks.length === 0 ? (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">Loading latest studies…</span>
          <ul className="mt-5 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} aria-hidden="true" className="animate-pulse py-5">
                <div className="h-3 w-36 rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
                <div className="mt-3 h-5 w-3/4 rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
                <div className="mt-3 h-3 w-full rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
              </li>
            ))}
          </ul>
        </div>
      ) : picks.length === 0 ? (
        <p className="mt-5 border-y border-line py-5 text-sm text-ink-muted dark:border-line-dark dark:text-ink-muted-dark">
          No studies are available yet. Check back after the next weekly refresh.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
          {picks.map(({ article, category, dateLabel }) => (
            <li key={article.id} className="py-5">
              <article>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark">
                  {category.title} · {dateLabel}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-ink dark:text-ink-inverse">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-accent dark:hover:text-accent-dark"
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-ink-muted dark:text-ink-muted-dark">
                  {truncate(article.snippet ?? "Open the PubMed record for study details.", 220)}
                </p>
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

interface Pick {
  article: ResearchCategory["articles"][number];
  category: { id: string; title: string };
  dateLabel: string;
  sortKey: number;
}

function pickHighlights(categories: ResearchCategory[], count: number): Pick[] {
  const all = categories.flatMap((category) =>
    (category.articles ?? []).map((article) => ({
      article,
      category: { id: category.id, title: category.title },
      dateLabel: formatPublishedShort(article.published) ?? "Recent",
      sortKey: publishedTimestamp(article.published),
    })),
  );

  return all.sort((a, b) => b.sortKey - a.sortKey).slice(0, count);
}
