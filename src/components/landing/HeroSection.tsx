import { useRef, useState } from "react";
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
      className="border-b border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark"
    >
      <div className="container max-w-3xl py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">
            Independent · source-linked · updated weekly
          </p>
          <h1
            id="search-heading"
            className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink dark:text-ink-inverse sm:text-5xl"
          >
            What would you like to understand?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-muted dark:text-ink-muted-dark sm:text-lg">
            Search plain-language summaries of curated schizophrenia research,
            with every result linked back to PubMed.
          </p>
        </div>

        <div className="mt-8">
          <EvidenceSearchForm
            loading={loading}
            disabled={Boolean(error)}
            onSubmit={handleSubmit}
          />
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
