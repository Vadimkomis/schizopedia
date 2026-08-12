import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TOPIC_LINKS } from "@/lib/topics";

export function BrowseTopics() {
  return (
    <section
      id="topics"
      aria-labelledby="topics-heading"
      className="container scroll-mt-24 py-12 lg:py-14"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">
            Browse
          </p>
          <h2
            id="topics-heading"
            className="mt-1 font-heading text-2xl font-semibold text-ink dark:text-ink-inverse sm:text-3xl"
          >
            Topics
          </h2>
        </div>
        <p className="hidden text-sm text-ink-muted dark:text-ink-muted-dark sm:block">
          Explore the curated evidence collections.
        </p>
      </div>
      <ul className="mt-6 grid overflow-hidden rounded-2xl border border-line bg-surface sm:grid-cols-2 dark:border-line-dark dark:bg-surface-dark">
        {TOPIC_LINKS.map((topic) => (
          <li
            key={topic.to}
            className="border-t border-line first:border-t-0 dark:border-line-dark sm:border-t-0 sm:odd:border-r sm:[&:nth-child(n+3)]:border-t"
          >
            <Link
              to={topic.to}
              className="group flex min-h-16 items-center justify-between gap-3 px-5 py-4 font-medium text-ink transition hover:bg-surface-subtle dark:text-ink-inverse dark:hover:bg-surface-dark-subtle"
            >
              {topic.label}
              <ArrowRight
                className="h-4 w-4 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-accent dark:text-ink-muted-dark dark:group-hover:text-accent-dark"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
