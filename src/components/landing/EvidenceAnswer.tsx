import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { EvidenceCitationList } from "./EvidenceCitationList";
import type { EvidenceSynthesis } from "@/lib/evidenceSearch";
import { TOPIC_LINKS } from "@/lib/topics";

export interface EvidenceAnswerProps {
  query: string;
  synthesis: EvidenceSynthesis;
}

export function EvidenceAnswer({ query, synthesis }: EvidenceAnswerProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [query]);

  return (
    <section
      aria-live="polite"
      aria-atomic="false"
      className="mt-6 rounded-2xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark sm:p-7"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-heading text-2xl font-semibold text-ink outline-none dark:text-ink-inverse"
      >
        Evidence for “{query}”
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-accent dark:bg-surface-dark-subtle dark:text-accent-dark">
          {synthesis.signal}
        </span>
        <span className="text-sm text-ink-muted dark:text-ink-muted-dark">
          {synthesis.signalDetail}
        </span>
      </div>
      <p className="mt-4 leading-7 text-ink dark:text-ink-inverse">
        {synthesis.answer}
      </p>

      {synthesis.directMatch ? (
        <EvidenceCitationList matches={synthesis.matches} />
      ) : (
        <nav aria-label="Browse evidence topics" className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {TOPIC_LINKS.map((topic) => (
            <Link
              key={topic.to}
              to={topic.to}
              className="text-sm font-semibold text-accent hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
            >
              {topic.label}
            </Link>
          ))}
        </nav>
      )}

      <p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-ink-muted dark:border-line-dark dark:text-ink-muted-dark">
        Educational information only. This summary is not medical advice and
        should not replace care from a qualified clinician.
      </p>
    </section>
  );
}
