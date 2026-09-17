import { useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { EvidenceAnswer } from "./EvidenceAnswer";
import { EvidenceSearchForm } from "./EvidenceSearchForm";
import {
  synthesizeEvidence,
  type EvidenceSynthesis,
} from "@/lib/evidenceSearch";
import type { ResearchCategory } from "@/lib/types";

export interface HeroSectionProps {
  categories: ResearchCategory[];
  loading?: boolean;
  error?: string | null;
}

interface SubmittedEvidence {
  id: number;
  query: string;
  synthesis: EvidenceSynthesis;
}

export function HeroSection({
  categories,
  loading = false,
  error = null,
}: HeroSectionProps) {
  const [submitted, setSubmitted] = useState<SubmittedEvidence | null>(null);
  const nextSubmissionId = useRef(0);

  const handleSubmit = (query: string) => {
    nextSubmissionId.current += 1;
    setSubmitted({
      id: nextSubmissionId.current,
      query,
      synthesis: synthesizeEvidence(query, categories),
    });
  };

  return (
    <section
      id="ask"
      aria-labelledby="search-heading"
      className="bg-surface dark:bg-canvas-dark"
    >
      <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pt-28">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface-subtle px-3 py-1.5 text-[11px] font-medium text-accent dark:bg-surface-dark-subtle dark:text-accent-dark sm:text-xs">
            <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Independent · source-linked · updated weekly
          </p>
          <h1
            id="search-heading"
            className="mx-auto mt-5 max-w-4xl font-heading text-4xl font-normal leading-[1.15] tracking-tight text-ink dark:text-ink-inverse sm:text-5xl lg:text-[3.25rem]"
          >
            What would you like to understand?
          </h1>
        </div>

        <div className="mt-8 sm:mt-10">
          <EvidenceSearchForm
            loading={loading}
            disabled={Boolean(error)}
            onSubmit={handleSubmit}
          />
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-ink-muted dark:text-ink-muted-dark">
            Search plain-language summaries of curated schizophrenia research,
            with every result linked back to PubMed.
          </p>
          {error && (
            <p
              role="status"
              className="mt-3 text-sm text-ink-muted dark:text-ink-muted-dark"
            >
              <strong className="text-ink dark:text-ink-inverse">
                Search index unavailable.
              </strong>{" "}
              Browse topics below while the source data reconnects.
            </p>
          )}
          {submitted && (
            <EvidenceAnswer
              key={submitted.id}
              query={submitted.query}
              synthesis={submitted.synthesis}
            />
          )}
        </div>
      </div>
    </section>
  );
}
