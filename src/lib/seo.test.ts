import { describe, expect, it } from "vitest";
import { resolveSeo, renderSeoTags } from "./seo";

describe("resolveSeo", () => {
  it("returns home metadata for the root path", () => {
    const meta = resolveSeo("/");
    expect(meta.title).toMatch(/schizopedia/i);
    expect(meta.path).toBe("/");
    expect(meta.jsonLd).toBeTruthy();
  });

  it("returns guide metadata for a known guide", () => {
    const meta = resolveSeo("/guide/early-warning-signs");
    expect(meta.title).toMatch(/early warning signs/i);
    expect(meta.path).toBe("/guide/early-warning-signs");
    expect(meta.type).toBe("article");
    expect(meta.jsonLd).toBeTruthy();
  });

  it("falls back to home for an unknown guide", () => {
    expect(resolveSeo("/guide/nope").path).toBe("/");
  });

  it("returns category metadata for a known category", () => {
    const meta = resolveSeo("/category/treatment");
    expect(meta.title).toMatch(/treatment/i);
    expect(meta.path).toBe("/category/treatment");
  });

  it("falls back to home for an unknown category", () => {
    expect(resolveSeo("/category/bogus").path).toBe("/");
  });

  it("returns dedicated metadata for legal pages", () => {
    expect(resolveSeo("/privacy").title).toMatch(/privacy/i);
    expect(resolveSeo("/terms").title).toMatch(/terms/i);
  });

  it("falls back to home for any unknown path", () => {
    expect(resolveSeo("/whatever").path).toBe("/");
  });
});

describe("renderSeoTags", () => {
  it("renders title, canonical, Open Graph, and Twitter tags", () => {
    const html = renderSeoTags(resolveSeo("/guide/getting-help"));
    expect(html).toContain("<title>");
    expect(html).toContain(
      '<link rel="canonical" href="https://schizopedia.com/guide/getting-help" />',
    );
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('name="twitter:card"');
  });

  it("escapes ampersands in titles", () => {
    const html = renderSeoTags(resolveSeo("/"));
    expect(html).toContain("&amp;");
    expect(html).not.toMatch(/<title>[^<]*&(?!amp;|lt;|gt;|quot;)/);
  });

  it("includes JSON-LD when present and escapes angle brackets", () => {
    const html = renderSeoTags(resolveSeo("/guide/getting-help"));
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("MedicalWebPage");
    expect(html).not.toContain("</script><");
  });

  it("omits JSON-LD for pages without structured data", () => {
    const html = renderSeoTags(resolveSeo("/privacy"));
    expect(html).not.toContain("application/ld+json");
  });
});
