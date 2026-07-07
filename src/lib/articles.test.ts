import { describe, expect, it } from "vitest";
import {
  allArticles,
  buildArticleIndex,
  evidenceRank,
  filterByKeywords,
  rankByImportance,
  resolveArticles,
  sortByPublishedDesc,
} from "./articles";
import type { ResearchArticle, ResearchCategory } from "./types";

function article(
  id: string,
  published?: string,
  evidenceLevel?: ResearchArticle["evidenceLevel"],
  extra?: Partial<ResearchArticle>,
): ResearchArticle {
  return {
    id,
    title: `Article ${id}`,
    url: `https://x/${id}`,
    published,
    evidenceLevel,
    ...extra,
  };
}

const categories: ResearchCategory[] = [
  {
    id: "a",
    title: "A",
    summary: "",
    articles: [article("1", "2026-06-12"), article("2", "2025-01-02")],
  },
  {
    id: "b",
    title: "B",
    summary: "",
    articles: [article("3", "2026-07-01"), article("1", "2026-06-12")],
  },
];

describe("buildArticleIndex", () => {
  it("indexes every article by id, keeping the first occurrence of duplicates", () => {
    const index = buildArticleIndex(categories);
    expect(index.size).toBe(3);
    expect(index.get("1")?.title).toBe("Article 1");
  });

  it("tolerates categories with no articles", () => {
    const index = buildArticleIndex([
      { id: "empty", title: "E", summary: "", articles: [] },
    ]);
    expect(index.size).toBe(0);
  });
});

describe("resolveArticles", () => {
  it("resolves ids in order and skips missing ones", () => {
    const index = buildArticleIndex(categories);
    const resolved = resolveArticles(["3", "missing", "1"], index);
    expect(resolved.map((a) => a.id)).toEqual(["3", "1"]);
  });
});

describe("sortByPublishedDesc", () => {
  it("orders newest first without mutating the input", () => {
    const input = [article("old", "2025-01-02"), article("new", "2026-07-01")];
    const sorted = sortByPublishedDesc(input);
    expect(sorted.map((a) => a.id)).toEqual(["new", "old"]);
    expect(input[0].id).toBe("old");
  });

  it("sinks undated articles to the bottom", () => {
    const sorted = sortByPublishedDesc([
      article("undated"),
      article("dated", "2026-01-01"),
    ]);
    expect(sorted.map((a) => a.id)).toEqual(["dated", "undated"]);
  });
});

describe("allArticles", () => {
  it("flattens and de-duplicates across categories", () => {
    expect(allArticles(categories).map((a) => a.id).sort()).toEqual([
      "1",
      "2",
      "3",
    ]);
  });
});

describe("evidenceRank", () => {
  it("ranks synthesis above clinical above exploratory above unknown", () => {
    expect(evidenceRank(article("a", undefined, "synthesis"))).toBe(3);
    expect(evidenceRank(article("b", undefined, "clinical"))).toBe(2);
    expect(evidenceRank(article("c", undefined, "exploratory"))).toBe(1);
    expect(evidenceRank(article("d"))).toBe(0);
  });
});

describe("rankByImportance", () => {
  it("orders by evidence level first, then recency", () => {
    const ranked = rankByImportance([
      article("new-exploratory", "2026-07-01", "exploratory"),
      article("old-review", "2020-01-01", "synthesis"),
      article("new-clinical", "2026-06-01", "clinical"),
    ]);
    expect(ranked.map((a) => a.id)).toEqual([
      "old-review",
      "new-clinical",
      "new-exploratory",
    ]);
  });

  it("breaks evidence ties by most recent", () => {
    const ranked = rankByImportance([
      article("older", "2025-01-01", "clinical"),
      article("newer", "2026-01-01", "clinical"),
    ]);
    expect(ranked.map((a) => a.id)).toEqual(["newer", "older"]);
  });
});

describe("filterByKeywords", () => {
  it("matches keywords in the title, case-insensitively", () => {
    const found = filterByKeywords(
      [article("1", undefined, undefined, { title: "Muscarinic receptors" })],
      ["muscarinic"],
    );
    expect(found).toHaveLength(1);
  });

  it("matches keywords in the abstract snippet", () => {
    const found = filterByKeywords(
      [article("1", undefined, undefined, { snippet: "a study of risk genes" })],
      ["gene"],
    );
    expect(found).toHaveLength(1);
  });

  it("excludes articles that mention none of the keywords", () => {
    const found = filterByKeywords(
      [article("1", undefined, undefined, { title: "Social support groups" })],
      ["muscarinic", "complement"],
    );
    expect(found).toHaveLength(0);
  });
});
