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
