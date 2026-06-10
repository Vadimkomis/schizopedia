import { describe, expect, it } from "vitest";
import { GUIDES, getAdjacentGuides, getGuide } from "./guides";

describe("GUIDES data integrity", () => {
  it("contains the five caregiver guides in reading order", () => {
    expect(GUIDES.map((g) => g.id)).toEqual([
      "what-is-schizophrenia",
      "early-warning-signs",
      "getting-help",
      "treatment-explained",
      "caring-for-yourself",
    ]);
  });

  it("gives every guide a title, description, reading time, and sections", () => {
    for (const guide of GUIDES) {
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.description.length).toBeGreaterThan(0);
      expect(guide.readingMinutes).toBeGreaterThan(0);
      expect(guide.sections.length).toBeGreaterThan(1);
    }
  });

  it("gives every section a heading and at least one paragraph", () => {
    for (const guide of GUIDES) {
      for (const section of guide.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });

  it("has unique guide ids", () => {
    const ids = GUIDES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes crisis guidance in the warning callouts", () => {
    const calloutTexts = GUIDES.flatMap((g) =>
      g.sections.map((s) => s.callout?.text ?? ""),
    ).join(" ");
    expect(calloutTexts).toMatch(/988/);
  });
});

describe("getGuide", () => {
  it("returns the guide for a known id", () => {
    expect(getGuide("getting-help")?.title).toMatch(/how to get help/i);
  });

  it("returns undefined for unknown or missing ids", () => {
    expect(getGuide("nope")).toBeUndefined();
    expect(getGuide(undefined)).toBeUndefined();
  });
});

describe("getAdjacentGuides", () => {
  it("returns no previous for the first guide", () => {
    const { previous, next } = getAdjacentGuides("what-is-schizophrenia");
    expect(previous).toBeUndefined();
    expect(next?.id).toBe("early-warning-signs");
  });

  it("returns no next for the last guide", () => {
    const { previous, next } = getAdjacentGuides("caring-for-yourself");
    expect(previous?.id).toBe("treatment-explained");
    expect(next).toBeUndefined();
  });

  it("returns neither for an unknown id", () => {
    expect(getAdjacentGuides("nope")).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
