import { describe, expect, it } from "vitest";
import { render } from "./entry-server";
import type { ResearchPayload } from "@/lib/types";

const payload: ResearchPayload = {
  lastUpdated: "2026-06-01T00:00:00.000Z",
  categories: [
    {
      id: "treatment",
      title: "Treatment",
      summary: "Explore treatments",
      articles: [
        {
          id: "p1",
          title: "A promising treatment study",
          url: "https://pubmed.ncbi.nlm.nih.gov/p1/",
          published: "2026 May 17",
          snippet: "Snippet.",
        },
      ],
    },
  ],
};

describe("entry-server render", () => {
  it("renders the landing page content and head into HTML strings", async () => {
    const { html, head } = await render("/", payload);
    expect(html).toMatch(/when schizophrenia touches someone you love/i);
    expect(head).toContain("<title>");
    expect(head).toContain('rel="canonical"');
  });

  it("renders a guide route to static markup with the guide title in head", async () => {
    const { html, head } = await render("/guide/early-warning-signs", null);
    expect(html).toMatch(/early warning signs/i);
    expect(head).toMatch(/early warning signs/i);
  });

  it("renders category articles when data is provided", async () => {
    const { html } = await render("/category/treatment", payload);
    expect(html).toContain("A promising treatment study");
  });

  it("does not leak the research global between renders", async () => {
    await render("/category/treatment", payload);
    expect(globalThis.__RESEARCH__).toBeUndefined();
  });
});
