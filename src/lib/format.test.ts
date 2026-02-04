import { describe, expect, it } from "vitest";
import { buildArticleMeta, formatAuthors, formatDateTime } from "./format";

describe("format helpers", () => {
  it("formats ISO strings into readable dates", () => {
    const formatted = formatDateTime("2024-08-22T12:00:00.000Z");
    expect(formatted).toMatch(/2024/);
  });

  it("handles invalid timestamps gracefully", () => {
    expect(formatDateTime("bad-date")).toBe("Pending sync…");
  });

  it("builds author strings", () => {
    expect(formatAuthors(["A", "B", "C"])).toBe("A et al.");
    expect(formatAuthors(["A"])).toBe("A");
    expect(formatAuthors([])).toBe("Authors unavailable");
  });

  it("builds metadata lines", () => {
    const meta = buildArticleMeta({
      id: "1",
      title: "Test",
      url: "https://example.com",
      journal: "Lancet",
      authors: ["One"],
      published: "2024",
    });

    expect(meta).toContain("Lancet");
    expect(meta).toContain("One");
  });
});
