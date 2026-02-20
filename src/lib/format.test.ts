import { describe, expect, it } from "vitest";
import { buildArticleMeta, formatAuthors, formatDateTime } from "./format";

describe("formatDateTime", () => {
  it("formats ISO strings into readable dates", () => {
    const formatted = formatDateTime("2024-08-22T12:00:00.000Z");
    expect(formatted).toMatch(/2024/);
  });

  it("handles invalid timestamps gracefully", () => {
    expect(formatDateTime("bad-date")).toBe("Pending sync\u2026");
  });

  it("returns pending for null input", () => {
    expect(formatDateTime(null)).toBe("Pending sync\u2026");
  });

  it("returns pending for undefined input", () => {
    expect(formatDateTime(undefined)).toBe("Pending sync\u2026");
  });

  it("returns pending for empty string", () => {
    expect(formatDateTime("")).toBe("Pending sync\u2026");
  });
});

describe("formatAuthors", () => {
  it("returns fallback for empty array", () => {
    expect(formatAuthors([])).toBe("Authors unavailable");
  });

  it("returns fallback for undefined", () => {
    expect(formatAuthors(undefined)).toBe("Authors unavailable");
  });

  it("returns single author as-is", () => {
    expect(formatAuthors(["Smith"])).toBe("Smith");
  });

  it("joins two authors with ampersand", () => {
    expect(formatAuthors(["Smith", "Jones"])).toBe("Smith & Jones");
  });

  it("uses et al. for three or more authors", () => {
    expect(formatAuthors(["A", "B", "C"])).toBe("A et al.");
  });
});

describe("buildArticleMeta", () => {
  it("combines journal, authors, and published date", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
      journal: "Lancet",
      authors: ["One"],
      published: "2024",
    });
    expect(meta).toBe("Lancet \u2022 One \u2022 2024");
  });

  it("handles missing journal", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
      authors: ["Smith"],
      published: "2024",
    });
    expect(meta).toBe("Smith \u2022 2024");
  });

  it("handles missing authors", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
      journal: "Nature",
      published: "2024",
    });
    expect(meta).toContain("Nature");
    expect(meta).toContain("Authors unavailable");
  });

  it("handles missing published date", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
      journal: "JAMA",
      authors: ["A", "B"],
    });
    expect(meta).toBe("JAMA \u2022 A & B");
  });

  it("handles minimal article (no optional fields)", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
    });
    expect(meta).toBe("Authors unavailable");
  });
});
