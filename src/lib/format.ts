import type { ResearchArticle } from "./types";

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Pending sync…";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending sync…";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function formatAuthors(authors?: string[]) {
  if (!authors || authors.length === 0) return "Authors unavailable";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
}

export function buildArticleMeta(article: ResearchArticle) {
  return [article.journal, formatAuthors(article.authors), article.published]
    .filter(Boolean)
    .join(" • ");
}

export function formatEvidenceLevel(
  level?: ResearchArticle["evidenceLevel"],
) {
  if (level === "synthesis") return "Higher-level synthesis";
  if (level === "clinical") return "Clinical evidence";
  if (level === "exploratory") return "Early-stage evidence";
  return "Evidence level pending";
}

export function formatActionability(
  actionability?: ResearchArticle["actionability"],
) {
  if (actionability === "discuss_with_clinician") {
    return "Useful for shared decisions with a licensed clinician.";
  }
  if (actionability === "learn") {
    return "Useful for learning and preparing informed questions.";
  }
  if (actionability === "emerging_only") {
    return "Promising but early. Not ready for direct personal action.";
  }
  return "Interpret carefully and verify details on PubMed.";
}
