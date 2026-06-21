import { describe, expect, it } from "vitest";
import { renderSitemap } from "./generateSitemap.mjs";
import { buildRoutes } from "./routes.mjs";

describe("renderSitemap", () => {
  const routes = buildRoutes();
  const xml = renderSitemap(routes, "https://schizopedia.org", "2026-06-20");

  it("emits a valid urlset with one entry per route", () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<urlset");
    expect(xml.match(/<url>/g)).toHaveLength(routes.length);
  });

  it("uses absolute URLs and a trailing slash for the homepage", () => {
    expect(xml).toContain("<loc>https://schizopedia.org/</loc>");
    expect(xml).toContain("<loc>https://schizopedia.org/guide/getting-help</loc>");
    expect(xml).toContain(
      "<loc>https://schizopedia.org/category/treatment</loc>",
    );
  });

  it("includes lastmod, changefreq, and priority for each url", () => {
    expect(xml).toContain("<lastmod>2026-06-20</lastmod>");
    expect(xml).toContain("<priority>1.0</priority>");
    expect(xml).toContain("<changefreq>weekly</changefreq>");
  });

  it("respects a custom site URL without a trailing duplicate", () => {
    const custom = renderSitemap(routes, "https://example.com", "2026-06-20");
    expect(custom).toContain("<loc>https://example.com/</loc>");
    expect(custom).not.toContain("https://schizopedia.org");
  });
});
