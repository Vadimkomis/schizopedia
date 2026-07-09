import { describe, expect, it } from "vitest";
import {
  barWidth,
  countriesByPrevalenceDesc,
  formatPercent,
  prevalence,
} from "./prevalence";

describe("prevalence data integrity", () => {
  it("has a plausible global figure sourced to WHO", () => {
    expect(prevalence.global.oneIn).toBeGreaterThan(0);
    expect(prevalence.global.percent).toBeGreaterThan(0);
    expect(prevalence.global.percent).toBeLessThan(1);
    expect(prevalence.global.sourceUrl).toMatch(/^https:\/\/www\.who\.int/);
  });

  it("cites the estimates source for country figures", () => {
    expect(prevalence.estimatesSource.name.length).toBeGreaterThan(0);
    expect(prevalence.estimatesSource.url).toMatch(/^https?:\/\//);
    expect(prevalence.estimatesSource.note.length).toBeGreaterThan(40);
  });

  it("lists countries with unique codes and plausible percentages", () => {
    const codes = prevalence.countries.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(prevalence.countries.length).toBeGreaterThanOrEqual(10);
    prevalence.countries.forEach((c) => {
      expect(c.name.length).toBeGreaterThan(0);
      // Schizophrenia prevalence is well within 0.1%–1% everywhere.
      expect(c.percent).toBeGreaterThan(0.1);
      expect(c.percent).toBeLessThan(1);
    });
  });
});

describe("countriesByPrevalenceDesc", () => {
  it("orders countries from highest to lowest prevalence", () => {
    const sorted = countriesByPrevalenceDesc();
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i - 1].percent).toBeGreaterThanOrEqual(sorted[i].percent);
    }
  });

  it("does not mutate the source array", () => {
    const before = prevalence.countries.map((c) => c.code);
    countriesByPrevalenceDesc();
    expect(prevalence.countries.map((c) => c.code)).toEqual(before);
  });
});

describe("formatPercent", () => {
  it("renders two decimal places with a percent sign", () => {
    expect(formatPercent(0.3)).toBe("0.30%");
    expect(formatPercent(0.325)).toBe("0.33%");
  });
});

describe("barWidth", () => {
  it("scales a value against the maximum", () => {
    expect(barWidth(0.35, 0.35)).toBe(100);
    expect(barWidth(0.175, 0.35)).toBe(50);
  });

  it("returns 0 when the maximum is non-positive", () => {
    expect(barWidth(0.3, 0)).toBe(0);
  });
});
