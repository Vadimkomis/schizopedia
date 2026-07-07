import { describe, expect, it } from "vitest";
import { formatPublishedShort, parseDateUtc, publishedTimestamp } from "./dates";

describe("parseDateUtc", () => {
  it("parses ISO dates in UTC", () => {
    expect(parseDateUtc("2026-06-12")?.getTime()).toBe(Date.UTC(2026, 5, 12));
  });

  it("parses PubMed 'YYYY Mon DD' dates", () => {
    expect(parseDateUtc("2026 Jun 12")?.getTime()).toBe(Date.UTC(2026, 5, 12));
  });

  it("parses PubMed 'YYYY Mon' with no day, defaulting to the 1st", () => {
    expect(parseDateUtc("2026 Jul")?.getTime()).toBe(Date.UTC(2026, 6, 1));
  });

  it("returns null for unparseable values", () => {
    expect(parseDateUtc("sometime soon")).toBeNull();
  });
});

describe("publishedTimestamp", () => {
  it("returns 0 for undefined", () => {
    expect(publishedTimestamp(undefined)).toBe(0);
  });

  it("falls back to a bare year", () => {
    expect(publishedTimestamp("published 2025 online")).toBe(
      Date.UTC(2025, 0, 1),
    );
  });

  it("orders newer dates above older ones", () => {
    expect(publishedTimestamp("2026 Jun 12")).toBeGreaterThan(
      publishedTimestamp("2025 Jul 26"),
    );
  });
});

describe("formatPublishedShort", () => {
  it("formats a full date", () => {
    expect(formatPublishedShort("2026-06-12")).toBe("Jun 12, 2026");
  });

  it("returns null for undefined", () => {
    expect(formatPublishedShort(undefined)).toBeNull();
  });

  it("falls back to a bare year when only a year is present", () => {
    expect(formatPublishedShort("2026")).toBe("2026");
  });
});
