import { describe, expect, it } from "vitest";
import { isValidEmail } from "./email";

describe("isValidEmail", () => {
  it("accepts a standard address", () => {
    expect(isValidEmail("reader@example.com")).toBe(true);
  });

  it("accepts addresses with plus tags and subdomains", () => {
    expect(isValidEmail("a.b+tag@mail.example.co.uk")).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(isValidEmail("  reader@example.com  ")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects a missing domain", () => {
    expect(isValidEmail("reader@")).toBe(false);
  });

  it("rejects a missing at-sign", () => {
    expect(isValidEmail("reader.example.com")).toBe(false);
  });

  it("rejects internal whitespace", () => {
    expect(isValidEmail("rea der@example.com")).toBe(false);
  });

  it("rejects a single-character TLD", () => {
    expect(isValidEmail("reader@example.c")).toBe(false);
  });
});
