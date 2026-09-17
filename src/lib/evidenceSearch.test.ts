import { describe, expect, it } from "vitest";
import { synthesizeEvidence } from "@/lib/evidenceSearch";
import type { ResearchCategory } from "@/lib/types";

const categories: ResearchCategory[] = [
  {
    id: "treatment",
    title: "Treatment",
    summary: "Treatment and medication evidence.",
    articles: [
      {
        id: "review",
        title: "Medication adherence in community mental health: A systematic review.",
        url: "https://pubmed.ncbi.nlm.nih.gov/review/",
        studyType: "Systematic review",
        evidenceLevel: "synthesis",
        published: "2026 Jul 12",
        snippet:
          "Medication nonadherence is common and is associated with poor clinical outcomes. The effectiveness of adherence therapy remains debated.",
      },
      {
        id: "exploratory",
        title: "Exploring motivation and negative symptoms.",
        url: "https://pubmed.ncbi.nlm.nih.gov/exploratory/",
        studyType: "Peer-reviewed study",
        evidenceLevel: "exploratory",
        published: "2026 Jul 10",
      },
    ],
  },
];

describe("synthesizeEvidence", () => {
  it("ranks title and synonym matches and prefers synthesis-level evidence", () => {
    const result = synthesizeEvidence(
      "What helps with medicine adherence?",
      categories,
    );

    expect(result.matches[0]?.article.id).toBe("review");
    expect(result.signal).toBe("Synthesis-led");
    expect(result.answer).toMatch(/systematic review/i);
  });

  it("labels exploratory-only results cautiously", () => {
    const result = synthesizeEvidence("negative motivation", categories);

    expect(result.matches[0]?.article.id).toBe("exploratory");
    expect(result.signal).toBe("Emerging evidence");
    expect(result.answer).toMatch(/active research direction/i);
  });

  it("returns an honest no-match response", () => {
    const result = synthesizeEvidence("housing policy", categories);

    expect(result.matches).toHaveLength(0);
    expect(result.directMatch).toBe(false);
    expect(result.signal).toBe("No direct match");
  });

  it("ranks an exact title phrase above token-only matches", () => {
    const result = synthesizeEvidence("family support", [
      {
        id: "care",
        title: "Care",
        summary: "Care research.",
        articles: [
          {
            id: "partial",
            title: "Support services for caregivers",
            snippet: "Family programs can help continuity.",
            url: "https://pubmed.ncbi.nlm.nih.gov/partial/",
            evidenceLevel: "synthesis",
            published: "2026-08-10",
          },
          {
            id: "exact",
            title: "Family support after a first episode",
            url: "https://pubmed.ncbi.nlm.nih.gov/exact/",
            evidenceLevel: "exploratory",
            published: "2024-01-01",
          },
        ],
      },
    ]);

    expect(result.matches[0]?.article.id).toBe("exact");
  });

  it("does not let an evidence bonus qualify one weak snippet hit", () => {
    const result = synthesizeEvidence("psychosis", [
      {
        id: "care",
        title: "Care",
        summary: "General care research.",
        articles: [
          {
            id: "weak-review",
            title: "A broad systematic review",
            snippet: "Psychosis is mentioned once.",
            url: "https://pubmed.ncbi.nlm.nih.gov/weak/",
            evidenceLevel: "synthesis",
          },
        ],
      },
    ]);

    expect(result.matches).toHaveLength(0);
    expect(result.directMatch).toBe(false);
  });

  it("does not qualify an article from category text alone", () => {
    const result = synthesizeEvidence("housing policy services", [
      {
        id: "housing-policy",
        title: "Housing Policy",
        summary: "Housing policy services research.",
        articles: [
          {
            id: "unrelated",
            title: "Nutrition outcomes in outpatient care",
            url: "https://pubmed.ncbi.nlm.nih.gov/unrelated/",
          },
        ],
      },
    ]);

    expect(result.matches).toHaveLength(0);
    expect(result.directMatch).toBe(false);
  });

  it("does not combine one weak snippet hit with category matches to qualify an article", () => {
    const result = synthesizeEvidence("psychosis community services", [
      {
        id: "community-services",
        title: "Community Services",
        summary: "Community services research.",
        articles: [
          {
            id: "weak-category-match",
            title: "Longitudinal outcomes",
            snippet: "Psychosis is mentioned once.",
            url: "https://pubmed.ncbi.nlm.nih.gov/weak-category-match/",
          },
        ],
      },
    ]);

    expect(result.matches).toHaveLength(0);
    expect(result.directMatch).toBe(false);
  });

  it("breaks equal relevance scores by newest publication", () => {
    const result = synthesizeEvidence("cognitive training", [
      {
        id: "treatment",
        title: "Treatment",
        summary: "Intervention research.",
        articles: [
          {
            id: "older",
            title: "Cognitive training outcomes in psychosis",
            url: "https://pubmed.ncbi.nlm.nih.gov/older/",
            published: "2024-01-01",
          },
          {
            id: "newer",
            title: "Cognitive training outcomes after diagnosis",
            url: "https://pubmed.ncbi.nlm.nih.gov/newer/",
            published: "2026-01-01",
          },
        ],
      },
    ]);

    expect(result.matches.map(({ article }) => article.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("uses category relevance to order articles only after each article qualifies", () => {
    const result = synthesizeEvidence("cognitive housing", [
      {
        id: "treatment",
        title: "Treatment",
        summary: "Intervention research.",
        articles: [
          {
            id: "input-first",
            title: "Cognitive outcomes study",
            url: "https://pubmed.ncbi.nlm.nih.gov/input-first/",
          },
        ],
      },
      {
        id: "housing",
        title: "Housing",
        summary: "Housing research.",
        articles: [
          {
            id: "category-ranked",
            title: "Cognitive outcomes study",
            url: "https://pubmed.ncbi.nlm.nih.gov/category-ranked/",
          },
        ],
      },
    ]);

    expect(result.matches.map(({ article }) => article.id)).toEqual([
      "category-ranked",
      "input-first",
    ]);
  });

  it("returns no more than three qualified matches even above the default limit", () => {
    const articles = Array.from({ length: 4 }, (_, index) => ({
      id: String(index),
      title: `Cognitive training study ${index}`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${index}/`,
    }));

    const result = synthesizeEvidence("cognitive training", [
      { id: "treatment", title: "Treatment", summary: "Care.", articles },
    ], 9);

    expect(result.matches).toHaveLength(3);
  });

  it("treats a negative result limit as zero", () => {
    const articles = Array.from({ length: 5 }, (_, index) => ({
      id: String(index),
      title: `Cognitive training study ${index}`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${index}/`,
    }));

    const result = synthesizeEvidence(
      "cognitive training",
      [{ id: "treatment", title: "Treatment", summary: "Care.", articles }],
      -1,
    );

    expect(result.matches).toHaveLength(0);
  });

  it("returns only the public evidence match fields", () => {
    const result = synthesizeEvidence("cognitive training", [
      {
        id: "treatment",
        title: "Treatment",
        summary: "Care.",
        articles: [
          {
            id: "study",
            title: "Cognitive training study",
            url: "https://pubmed.ncbi.nlm.nih.gov/study/",
          },
        ],
      },
    ]);

    expect(Object.keys(result.matches[0] ?? {}).sort()).toEqual([
      "article",
      "category",
      "score",
    ]);
  });

  it("describes clinical-only evidence without claiming causation", () => {
    const result = synthesizeEvidence("relapse outcomes", [
      {
        id: "treatment",
        title: "Treatment",
        summary: "Care.",
        articles: [
          {
            id: "clinical",
            title: "Relapse outcomes in community care",
            url: "https://pubmed.ncbi.nlm.nih.gov/clinical/",
            studyType: "Observational study",
            evidenceLevel: "clinical",
          },
        ],
      },
    ]);

    expect(result.signal).toBe("Clinical signal");
    expect(result.signalDetail).toMatch(/human clinical source/i);
    expect(result.signalDetail).not.toMatch(/observational/i);
    expect(result.answer).toMatch(/cannot prove cause and effect/i);
  });

  it("describes a randomized trial as a single-study clinical signal", () => {
    const result = synthesizeEvidence("relapse prevention", [
      {
        id: "treatment",
        title: "Treatment",
        summary: "Care.",
        articles: [
          {
            id: "randomized-trial",
            title: "Relapse prevention outcomes in a randomized trial",
            url: "https://pubmed.ncbi.nlm.nih.gov/randomized-trial/",
            studyType: "Randomized controlled trial",
            evidenceLevel: "clinical",
          },
        ],
      },
    ]);

    expect(result.signal).toBe("Clinical signal");
    expect(result.signalDetail).toMatch(/human clinical source/i);
    expect(result.signalDetail).not.toMatch(/observational/i);
    expect(result.answer).toMatch(/single study/i);
    expect(result.answer).toMatch(/should not guide treatment decisions/i);
    expect(result.answer).not.toMatch(/observational/i);
  });
});
