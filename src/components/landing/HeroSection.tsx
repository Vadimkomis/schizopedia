import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpenCheck,
  Database,
  FileCheck2,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { synthesizeEvidence } from "@/lib/evidenceSearch";
import type { ResearchCategory } from "@/lib/types";

export interface HeroSectionProps {
  categories: ResearchCategory[];
  loading?: boolean;
  totalArticles: number;
  lastUpdated?: string | null;
}

const DEFAULT_QUESTION = "What helps with medication adherence?";

const SUGGESTED_QUESTIONS = [
  "How are negative symptoms being studied?",
  "What helps with antipsychotic weight gain?",
  "What research exists on early detection?",
];

export function HeroSection({
  categories,
  loading = false,
  totalArticles,
  lastUpdated,
}: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(DEFAULT_QUESTION);
  const synthesis = useMemo(
    () => synthesizeEvidence(submittedQuery, categories),
    [categories, submittedQuery],
  );

  function ask(question: string) {
    const nextQuestion = question.trim();
    if (!nextQuestion) return;
    setQuery(nextQuestion);
    setSubmittedQuery(nextQuestion);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(query);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      ask(query);
    }
  }

  return (
    <section id="ask" className="evidence-hero scroll-mt-24 overflow-hidden">
      <div className="evidence-grid" aria-hidden="true" />
      <div className="container relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center fade-up">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            Independent · citation-first · updated weekly
          </p>
          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-[#142621] sm:text-6xl lg:text-[76px] dark:text-white">
            Ask a hard question.
            <span className="block italic text-[#397864] dark:text-[#8ad1ba]">
              See the evidence clearly.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            A grounded research companion for schizophrenia—built for families,
            caregivers, and curious minds who want the source, not just the answer.
          </p>
        </div>

        <form
          role="search"
          aria-label="Ask Schizopedia evidence search"
          onSubmit={handleSubmit}
          className="mx-auto mt-9 max-w-4xl fade-up"
        >
          <div className="ask-composer">
            <Search className="ask-composer-icon" aria-hidden="true" />
            <label htmlFor="evidence-question" className="sr-only">
              Ask a question about schizophrenia research
            </label>
            <textarea
              id="evidence-question"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask about symptoms, treatment, diagnosis, family support…"
              className="ask-composer-input"
            />
            <button type="submit" className="ask-composer-button">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Synthesize
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Try
            </span>
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => ask(question)}
                className="question-chip"
              >
                {question}
              </button>
            ))}
          </div>
        </form>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="answer-panel" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="answer-panel-icon">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-white">
                  Grounded evidence answer
                </p>
              </div>
              <span
                className={`evidence-signal ${
                  synthesis.directMatch ? "evidence-signal-live" : ""
                }`}
              >
                {loading ? "Refreshing index" : synthesis.signal}
              </span>
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Your question
            </p>
            <h2 className="mt-2 max-w-2xl font-heading text-2xl font-medium leading-tight text-white sm:text-3xl">
              {submittedQuery}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75">
              {synthesis.answer}
            </p>

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Evidence trail
                </p>
                <p className="text-xs text-white/45">{synthesis.signalDetail}</p>
              </div>
              {synthesis.matches.length > 0 ? (
                <ol className="mt-3 space-y-2">
                  {synthesis.matches.map(({ article }, index) => (
                    <li key={article.id}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="evidence-citation"
                      >
                        <span className="evidence-citation-number">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 block font-medium text-white/90">
                            {article.title}
                          </span>
                          <span className="mt-1 block text-xs text-white/45">
                            {[article.journal, article.studyType, article.published]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-white/40"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-white/55">
                  No close source match yet. Try one of the suggested questions
                  above.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-white/45">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                Educational only. The synthesis is generated from Schizopedia&apos;s
                curated index and cannot diagnose, prescribe, or replace professional care.
              </p>
            </div>
          </article>

          <EvidenceNetwork
            categories={categories}
            totalArticles={totalArticles}
            lastUpdated={lastUpdated}
          />
        </div>

        <HeroStats totalArticles={totalArticles} lastUpdated={lastUpdated} />
      </div>
    </section>
  );
}

function EvidenceNetwork({
  categories,
  totalArticles,
  lastUpdated,
}: Pick<HeroSectionProps, "categories" | "totalArticles" | "lastUpdated">) {
  const articles = categories.flatMap((category) => category.articles ?? []);
  const synthesisCount = articles.filter(
    (article) => article.evidenceLevel === "synthesis",
  ).length;
  const clinicalCount = articles.filter(
    (article) => article.evidenceLevel === "clinical",
  ).length;

  return (
    <aside className="network-panel" aria-labelledby="network-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#397864] dark:text-[#8ad1ba]">
            <Network className="h-4 w-4" aria-hidden="true" />
            Integrated evidence network
          </p>
          <h2
            id="network-heading"
            className="mt-2 font-heading text-2xl font-semibold leading-tight text-[#142621] dark:text-white"
          >
            One question, every source in view.
          </h2>
        </div>
        <span className="network-live-pill">
          <span aria-hidden="true" />
          Live index
        </span>
      </div>

      <div
        className="evidence-network-map"
        role="img"
        aria-label={`Evidence network connecting ${totalArticles} indexed studies, ${synthesisCount} research syntheses, clinical evidence, guides, and primary PubMed sources`}
      >
        <div className="network-halo network-halo-one" aria-hidden="true" />
        <div className="network-halo network-halo-two" aria-hidden="true" />
        <div className="network-line network-line-one" aria-hidden="true" />
        <div className="network-line network-line-two" aria-hidden="true" />
        <div className="network-line network-line-three" aria-hidden="true" />
        <div className="network-line network-line-four" aria-hidden="true" />

        <div className="network-core">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <span>Evidence AI</span>
        </div>
        <NetworkNode
          className="network-node-pubmed"
          icon={Database}
          label="PubMed"
          value={`${totalArticles} indexed`}
        />
        <NetworkNode
          className="network-node-review"
          icon={FileCheck2}
          label="Syntheses"
          value={`${synthesisCount} reviews`}
        />
        <NetworkNode
          className="network-node-clinical"
          icon={BookOpenCheck}
          label="Clinical"
          value={`${clinicalCount} studies`}
        />
        <NetworkNode
          className="network-node-guides"
          icon={ShieldCheck}
          label="Guides"
          value="5 plain-language"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-4 dark:border-white/10">
        <NetworkStat
          label="Primary links"
          value="100%"
          icon={ArrowUpRight}
        />
        <NetworkStat
          label="Last refreshed"
          value={lastUpdated ? formatDateTime(lastUpdated) : "Sync pending"}
          icon={Database}
          compact
        />
      </div>
    </aside>
  );
}

function NetworkNode({
  className,
  icon: Icon,
  label,
  value,
}: {
  className: string;
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className={`network-node ${className}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        <small>{value}</small>
      </span>
    </div>
  );
}

function NetworkStat({
  label,
  value,
  icon: Icon,
  compact = false,
}: {
  label: string;
  value: string;
  icon: typeof Database;
  compact?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f1ec] text-[#397864] dark:bg-emerald-400/10 dark:text-emerald-300">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div>
        <p
          className={`font-semibold text-[#142621] dark:text-white ${
            compact ? "text-xs leading-5" : "text-sm"
          }`}
        >
          {value}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function HeroStats({
  totalArticles,
  lastUpdated,
}: Pick<HeroSectionProps, "totalArticles" | "lastUpdated">) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#19372f]/10 pt-6 dark:border-white/10 md:grid-cols-4">
      <StatItem value={String(totalArticles)} label="studies in the live index" />
      <StatItem value="Weekly" label="automatic PubMed refresh" />
      <StatItem value="100%" label="linked to primary sources" />
      <StatItem
        value={lastUpdated ? formatDateTime(lastUpdated) : "Pending sync…"}
        label="most recent evidence refresh"
        compact
      />
    </dl>
  );
}

function StatItem({
  value,
  label,
  compact = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="order-2 text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`order-1 font-heading font-semibold text-[#142621] dark:text-white ${
          compact ? "text-sm leading-5" : "text-2xl"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
