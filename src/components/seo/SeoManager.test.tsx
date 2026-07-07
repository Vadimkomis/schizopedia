import { beforeEach, describe, expect, it } from "vitest";
import { SeoManager } from "./SeoManager";
import { renderWithRouter } from "@/test/render";

function renderAt(path: string) {
  return renderWithRouter(<SeoManager />, { initialEntries: [path] });
}

describe("SeoManager", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("sets the document title from the current route", () => {
    renderAt("/guide/getting-help");
    expect(document.title).toMatch(/how to get help/i);
    expect(document.title).toMatch(/schizopedia/i);
  });

  it("sets the canonical link for the route", () => {
    renderAt("/privacy");
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://schizopedia.com/privacy");
  });
});
