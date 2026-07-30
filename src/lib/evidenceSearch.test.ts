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
});
