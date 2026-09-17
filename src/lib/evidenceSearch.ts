import { publishedTimestamp } from "@/lib/dates";
import type { ResearchArticle, ResearchCategory } from "@/lib/types";

export interface EvidenceMatch {
  article: ResearchArticle;
  category: Pick<ResearchCategory, "id" | "title">;
  score: number;
}

export interface EvidenceSynthesis {
  answer: string;
  directMatch: boolean;
  matches: EvidenceMatch[];
  signal: "Synthesis-led" | "Clinical signal" | "Emerging evidence" | "No direct match";
  signalDetail: string;
}

export const MIN_RELEVANCE_SCORE = 3;

const STOP_WORDS = new Set([
  "a",
  "about",
  "are",
  "can",
  "current",
  "do",
  "does",
  "for",
  "help",
  "helps",
  "how",
  "in",
  "is",
  "of",
  "say",
  "the",
  "to",
  "what",
  "with",
]);

const SYNONYM_GROUPS = [
  ["adherence", "continuity", "medication", "medicine"],
  ["antipsychotic", "antipsychotics", "drug", "medication", "medicine"],
  ["diagnosis", "diagnostic", "screening", "assessment", "biomarker"],
  ["early", "first-episode", "prediction", "risk", "screening"],
  ["family", "caregiver", "caregivers", "community", "support"],
  ["metabolic", "weight", "cardiometabolic"],
  ["negative", "motivation", "social", "withdrawal"],
  ["therapy", "treatment", "intervention", "care"],
] as const;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}-]+/gu, " ")
    .trim();
}

function queryTokens(query: string): Set<string> {
  const base = normalize(query)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
  const expanded = new Set(base);

  SYNONYM_GROUPS.forEach((group) => {
    if (group.some((term) => expanded.has(term))) {
      group.forEach((term) => expanded.add(term));
    }
  });

  return expanded;
}

function scoreArticleText(
  query: string,
  tokens: Set<string>,
  article: ResearchArticle,
): number {
  const title = normalize(article.title);
  const snippet = normalize(article.snippet ?? "");
  const metadata = normalize(
    [
      article.studyType,
      article.evidenceLevel,
      article.actionability,
      ...(article.categoryTags ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
  const normalizedQuery = normalize(query);
  let score = 0;

  if (normalizedQuery.length > 5 && title.includes(normalizedQuery)) score += 16;
  tokens.forEach((token) => {
    if (title.includes(token)) score += 5;
    if (snippet.includes(token)) score += 2;
    if (metadata.includes(token)) score += 2;
  });

  return score;
}

function scoreCategoryText(tokens: Set<string>, category: ResearchCategory): number {
  const categoryText = normalize(`${category.id} ${category.title} ${category.summary}`);
  let score = 0;

  tokens.forEach((token) => {
    if (categoryText.includes(token)) score += 1;
  });

  return score;
}

function evidenceBonus(article: ResearchArticle): number {
  if (article.evidenceLevel === "synthesis") return 2;
  if (article.evidenceLevel === "clinical") return 1;
  return 0;
}

function tidyTitle(title: string): string {
  const sentence = title.replace(/[.!?]+$/, "").trim();
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

function firstCompleteSentence(snippet?: string): string | null {
  if (!snippet) return null;
  const cleaned = snippet.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.{45,260}?[.!?])(?:\s|$)/);
  return match?.[1] ?? null;
}

function clinicalCaution(studyType?: string): string {
  const normalizedStudyType = normalize(studyType ?? "");
  const isObservational = [
    "observational",
    "cohort",
    "case-control",
    "case control",
    "cross-sectional",
    "cross sectional",
  ].some((design) => normalizedStudyType.includes(design));

  if (isObservational) {
    return "It offers a clinical signal, but observational findings cannot prove cause and effect.";
  }

  const isTrial = ["trial", "randomized", "randomised"].some((design) =>
    normalizedStudyType.includes(design),
  );

  if (isTrial) {
    return "It offers a clinical signal from a trial, but a single study should not guide treatment decisions on its own.";
  }

  return "It offers a clinical signal from a single study, but one source should not guide treatment decisions on its own.";
}

function evidenceSignal(matches: EvidenceMatch[]): Pick<
  EvidenceSynthesis,
  "signal" | "signalDetail"
> {
  if (matches.length === 0) {
    return {
      signal: "No direct match",
      signalDetail: "Try a symptom, treatment, side effect, or research topic.",
    };
  }

  const synthesisCount = matches.filter(
    ({ article }) => article.evidenceLevel === "synthesis",
  ).length;
  const clinicalCount = matches.filter(
    ({ article }) => article.evidenceLevel === "clinical",
  ).length;

  if (synthesisCount > 0) {
    return {
      signal: "Synthesis-led",
      signalDetail: `${synthesisCount} review${synthesisCount === 1 ? "" : "s"} among the strongest matches`,
    };
  }
  if (clinicalCount > 0) {
    return {
      signal: "Clinical signal",
      signalDetail: `${clinicalCount} human clinical source${clinicalCount === 1 ? "" : "s"} in the evidence set`,
    };
  }
  return {
    signal: "Emerging evidence",
    signalDetail: "The strongest matches are exploratory and need cautious interpretation.",
  };
}

function buildAnswer(query: string, matches: EvidenceMatch[]): string {
  if (matches.length === 0) {
    return `The current Schizopedia index does not contain a close source match for “${query}”. Try a more specific term, or use the evidence collections below to browse by topic.`;
  }

  const lead = matches[0].article;
  const descriptor = lead.studyType?.toLowerCase() ?? "peer-reviewed study";
  const excerpt = firstCompleteSentence(lead.snippet);
  const leadSentence = `The strongest match is a ${descriptor} examining ${tidyTitle(lead.title)}.`;

  if (lead.evidenceLevel === "synthesis") {
    return `${leadSentence}${excerpt ? ` ${excerpt}` : ""} Because this is synthesis-level evidence, it is a useful starting point for a clinician conversation—not a reason to change care on its own.`;
  }
  if (lead.evidenceLevel === "clinical") {
    return `${leadSentence}${excerpt ? ` ${excerpt}` : ""} ${clinicalCaution(lead.studyType)}`;
  }
  return `${leadSentence}${excerpt ? ` ${excerpt}` : ""} The available match is exploratory, so treat it as an active research direction rather than settled guidance.`;
}

export function synthesizeEvidence(
  query: string,
  categories: ResearchCategory[],
  limit = 3,
): EvidenceSynthesis {
  const cleanQuery = query.trim();
  const tokens = queryTokens(cleanQuery);
  const boundedLimit = Math.max(0, Math.min(limit, 3));

  if (!cleanQuery || tokens.size === 0) {
    return {
      answer:
        "Ask a specific question to search the curated evidence index and build a source-linked summary.",
      directMatch: false,
      matches: [],
      signal: "No direct match",
      signalDetail: "Your question stays on this device.",
    };
  }

  const matches = categories
    .flatMap((category) =>
      (category.articles ?? []).map((article) => {
        const articleTextScore = scoreArticleText(cleanQuery, tokens, article);
        const categoryScore = scoreCategoryText(tokens, category);
        return {
          article,
          category: { id: category.id, title: category.title },
          articleTextScore,
          score: articleTextScore + categoryScore + evidenceBonus(article),
        };
      }),
    )
    .filter(({ articleTextScore }) => articleTextScore >= MIN_RELEVANCE_SCORE)
    .sort(
      (a, b) =>
        b.score - a.score ||
        publishedTimestamp(b.article.published) -
          publishedTimestamp(a.article.published),
    )
    .slice(0, boundedLimit)
    .map(({ article, category, score }) => ({ article, category, score }));

  return {
    answer: buildAnswer(cleanQuery, matches),
    directMatch: matches.length > 0,
    matches,
    ...evidenceSignal(matches),
  };
}
