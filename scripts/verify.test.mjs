import { describe, expect, it } from "vitest";
import {
  expectedUrl,
  normalizeText,
  verifyArticle,
  verifyPayload,
} from "./verify.mjs";

const liveRecord = {
  title: "Cognitive remediation in early psychosis.",
  fulljournalname: "Schizophrenia Research",
  source: "Schizophr Res",
};

const storedArticle = {
  id: "12345",
  title: "Cognitive remediation in early psychosis.",
  journal: "Schizophrenia Research",
  url: "https://pubmed.ncbi.nlm.nih.gov/12345/",
};

describe("normalizeText", () => {
  it("strips HTML tags, entities, punctuation, and case", () => {
    expect(normalizeText("The <i>NMDA</i> receptor &amp; psychosis.")).toBe(
      "the nmda receptor psychosis",
    );
  });

  it("returns an empty string for non-string input", () => {
    expect(normalizeText(undefined)).toBe("");
    expect(normalizeText(null)).toBe("");
  });
});

describe("verifyArticle", () => {
  it("passes a faithful article", () => {
    expect(verifyArticle(storedArticle, liveRecord)).toEqual([]);
  });

  it("flags a missing live record", () => {
    const problems = verifyArticle(storedArticle, undefined);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/no live pubmed record/i);
  });

  it("flags a title that does not match the live record", () => {
    const problems = verifyArticle(
      { ...storedArticle, title: "A completely different claim" },
      liveRecord,
    );
    expect(problems.some((p) => p.includes("Title mismatch"))).toBe(true);
  });

  it("tolerates markup and punctuation differences in titles", () => {
    const problems = verifyArticle(
      { ...storedArticle, title: "Cognitive remediation in early psychosis" },
      { ...liveRecord, title: "Cognitive <b>remediation</b> in early psychosis." },
    );
    expect(problems).toEqual([]);
  });

  it("flags a URL pointing at a different PMID", () => {
    const problems = verifyArticle(
      { ...storedArticle, url: "https://pubmed.ncbi.nlm.nih.gov/99999/" },
      liveRecord,
    );
    expect(problems.some((p) => p.includes("canonical PubMed record"))).toBe(
      true,
    );
  });

  it("accepts the abbreviated journal name as a match", () => {
    const problems = verifyArticle(
      { ...storedArticle, journal: "Schizophr Res" },
      liveRecord,
    );
    expect(problems).toEqual([]);
  });

  it("flags a journal that matches neither live name", () => {
    const problems = verifyArticle(
      { ...storedArticle, journal: "Made Up Journal" },
      liveRecord,
    );
    expect(problems.some((p) => p.includes("Journal mismatch"))).toBe(true);
  });
});

describe("verifyPayload", () => {
  it("counts verified articles and collects issues per category", () => {
    const payload = {
      categories: [
        {
          id: "diagnosis",
          articles: [storedArticle, { ...storedArticle, id: "67890" }],
        },
      ],
    };
    const result = verifyPayload(payload, { "12345": liveRecord });

    expect(result.checked).toBe(2);
    expect(result.verified).toBe(1);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatchObject({
      categoryId: "diagnosis",
      articleId: "67890",
    });
  });

  it("handles an empty payload without errors", () => {
    expect(verifyPayload({}, {})).toEqual({
      checked: 0,
      verified: 0,
      issues: [],
    });
  });
});

describe("expectedUrl", () => {
  it("builds the canonical PubMed URL", () => {
    expect(expectedUrl("42")).toBe("https://pubmed.ncbi.nlm.nih.gov/42/");
  });
});
