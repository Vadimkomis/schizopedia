import { describe, expect, it } from "vitest";
import { classifyArticle } from "./classify.mjs";

describe("classifyArticle", () => {
  it("classifies meta-analyses as synthesis evidence", () => {
    const result = classifyArticle({
      title: "Antipsychotic efficacy in schizophrenia",
      pubTypes: ["Journal Article", "Meta-Analysis"],
    });
    expect(result).toEqual({
      studyType: "Meta-analysis",
      evidenceLevel: "synthesis",
      actionability: "discuss_with_clinician",
    });
  });

  it("classifies systematic reviews from pubtype", () => {
    const result = classifyArticle({
      title: "Cognitive remediation outcomes",
      pubTypes: ["Systematic Review"],
    });
    expect(result.studyType).toBe("Systematic review");
    expect(result.evidenceLevel).toBe("synthesis");
  });

  it("classifies systematic reviews from title when pubtype is generic", () => {
    const result = classifyArticle({
      title: "A systematic review of early intervention in psychosis",
      pubTypes: ["Journal Article"],
    });
    expect(result.studyType).toBe("Systematic review");
    expect(result.evidenceLevel).toBe("synthesis");
  });

  it("classifies plain reviews as synthesis", () => {
    const result = classifyArticle({
      title: "Dopamine hypothesis revisited",
      pubTypes: ["Review"],
    });
    expect(result.studyType).toBe("Review");
    expect(result.evidenceLevel).toBe("synthesis");
  });

  it("classifies randomized controlled trials as clinical evidence", () => {
    const result = classifyArticle({
      title: "Olanzapine versus placebo",
      pubTypes: ["Randomized Controlled Trial"],
    });
    expect(result).toEqual({
      studyType: "Randomized controlled trial",
      evidenceLevel: "clinical",
      actionability: "discuss_with_clinician",
    });
  });

  it("detects randomised trials from British-spelling titles", () => {
    const result = classifyArticle({
      title: "A randomised double-blind trial of clozapine augmentation",
      pubTypes: ["Journal Article"],
    });
    expect(result.studyType).toBe("Randomized controlled trial");
  });

  it("classifies clinical trials without randomization tag", () => {
    const result = classifyArticle({
      title: "Open-label study of cariprazine",
      pubTypes: ["Clinical Trial"],
    });
    expect(result.studyType).toBe("Clinical trial");
    expect(result.evidenceLevel).toBe("clinical");
  });

  it("classifies case reports as exploratory and emerging-only", () => {
    const result = classifyArticle({
      title: "Late-onset psychosis in a 70-year-old",
      pubTypes: ["Case Reports"],
    });
    expect(result).toEqual({
      studyType: "Case report",
      evidenceLevel: "exploratory",
      actionability: "emerging_only",
    });
  });

  it("classifies cohort studies as observational from keywords", () => {
    const result = classifyArticle({
      title: "Risk factors in a population-based cohort",
      pubTypes: ["Journal Article"],
    });
    expect(result).toEqual({
      studyType: "Observational study",
      evidenceLevel: "clinical",
      actionability: "learn",
    });
  });

  it("classifies animal studies as preclinical and emerging-only", () => {
    const result = classifyArticle({
      title: "NMDA receptor changes in a mouse model of schizophrenia",
      pubTypes: ["Journal Article"],
    });
    expect(result).toEqual({
      studyType: "Preclinical study",
      evidenceLevel: "exploratory",
      actionability: "emerging_only",
    });
  });

  it("falls back to peer-reviewed exploratory for unrecognized articles", () => {
    const result = classifyArticle({
      title: "Neurovascular coupling changes after treatment",
      pubTypes: ["Journal Article"],
    });
    expect(result).toEqual({
      studyType: "Peer-reviewed study",
      evidenceLevel: "exploratory",
      actionability: "learn",
    });
  });

  it("handles empty input without crashing", () => {
    const result = classifyArticle({});
    expect(result.studyType).toBe("Peer-reviewed study");
    expect(result.evidenceLevel).toBe("exploratory");
    expect(result.actionability).toBe("learn");
  });

  it("uses the snippet as well as the title for keyword detection", () => {
    const result = classifyArticle({
      title: "Glutamate signaling in psychosis",
      snippet: "We performed experiments in vitro using cultured neurons.",
      pubTypes: ["Journal Article"],
    });
    expect(result.studyType).toBe("Preclinical study");
  });
});
