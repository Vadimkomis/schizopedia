import { describe, expect, it } from "vitest";
import {
  CATEGORY_CONTENT_IDS,
  getCategoryContent,
} from "./categoryContent";

describe("categoryContent", () => {
  it("covers the four launch categories", () => {
    expect([...CATEGORY_CONTENT_IDS].sort()).toEqual([
      "cure",
      "diagnosis",
      "prevention",
      "treatment",
    ]);
  });

  it("returns undefined for unknown ids", () => {
    expect(getCategoryContent("nope")).toBeUndefined();
  });

  it.each(CATEGORY_CONTENT_IDS)(
    "provides complete editorial content for '%s'",
    (id) => {
      const content = getCategoryContent(id)!;
      expect(content.title.length).toBeGreaterThan(0);
      expect(content.summary.length).toBeGreaterThan(0);
      expect(content.seoDescription.length).toBeGreaterThan(0);
      expect(content.stateOfField.length).toBeGreaterThanOrEqual(2);
      content.stateOfField.forEach((p) => expect(p.length).toBeGreaterThan(40));
    },
  );

  it("sources the data-less cure category from a cross-category keyword search", () => {
    const cure = getCategoryContent("cure")!;
    expect(cure.pool).toBe("cross");
    expect(cure.keywords?.length ?? 0).toBeGreaterThan(0);
  });

  it("sources data-backed categories from their own feed", () => {
    expect(getCategoryContent("diagnosis")?.pool).toBe("own");
    expect(getCategoryContent("diagnosis")?.keywords).toBeUndefined();
  });
});
