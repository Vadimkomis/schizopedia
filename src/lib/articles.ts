import { publishedTimestamp } from "@/lib/dates";
import type { ResearchArticle, ResearchCategory } from "@/lib/types";

/** A flat lookup of every article across categories, keyed by PMID. */
export type ArticleIndex = Map<string, ResearchArticle>;

export function buildArticleIndex(categories: ResearchCategory[]): ArticleIndex {
  const index: ArticleIndex = new Map();
  categories.forEach((category) => {
    (category.articles ?? []).forEach((article) => {
      if (!index.has(article.id)) index.set(article.id, article);
    });
  });
  return index;
}

/** Resolves an ordered id list to articles, skipping any that aren't present. */
export function resolveArticles(
  ids: string[],
  index: ArticleIndex,
): ResearchArticle[] {
  return ids
    .map((id) => index.get(id))
    .filter((article): article is ResearchArticle => Boolean(article));
}

/** Newest first, by publication date (undated articles sink to the bottom). */
export function sortByPublishedDesc(
  articles: ResearchArticle[],
): ResearchArticle[] {
  return [...articles].sort(
    (a, b) => publishedTimestamp(b.published) - publishedTimestamp(a.published),
  );
}

/** All articles across categories, de-duplicated by id (first occurrence wins). */
export function allArticles(categories: ResearchCategory[]): ResearchArticle[] {
  return [...buildArticleIndex(categories).values()];
}

const EVIDENCE_RANK: Record<string, number> = {
  synthesis: 3,
  clinical: 2,
  exploratory: 1,
};

/** How strong a study is as evidence — reviews/meta-analyses rank highest. */
export function evidenceRank(article: ResearchArticle): number {
  return EVIDENCE_RANK[article.evidenceLevel ?? ""] ?? 0;
}

/**
 * "Most important first": strongest evidence, then most recent. Evidence
 * dominates so a review always outranks a newer exploratory study; recency
 * only breaks ties within the same evidence tier.
 */
export function rankByImportance(
  articles: ResearchArticle[],
): ResearchArticle[] {
  return [...articles].sort((a, b) => {
    const byEvidence = evidenceRank(b) - evidenceRank(a);
    if (byEvidence !== 0) return byEvidence;
    return publishedTimestamp(b.published) - publishedTimestamp(a.published);
  });
}

/** Studies whose title or abstract mentions any of the given keywords. */
export function filterByKeywords(
  articles: ResearchArticle[],
  keywords: string[],
): ResearchArticle[] {
  const needles = keywords.map((k) => k.toLowerCase());
  return articles.filter((article) => {
    const haystack = `${article.title} ${article.snippet ?? ""}`.toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
  });
}
