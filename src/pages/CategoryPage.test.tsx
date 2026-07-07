import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryPage } from "./CategoryPage";
import { renderWithProviders } from "@/test/render";
import type { ResearchPayload } from "@/lib/types";

const payload: ResearchPayload = {
  lastUpdated: "2026-03-01T00:00:00.000Z",
  categories: [
    {
      id: "diagnosis",
      title: "Diagnosis",
      summary: "Diagnosis summary",
      articles: [
        {
          id: "d1",
          title: "Diagnosis systematic review",
          url: "https://pubmed.ncbi.nlm.nih.gov/d1/",
          published: "2026-02-10",
          snippet: "dx review abstract",
          evidenceLevel: "synthesis",
        },
        {
          id: "d2",
          title: "Diagnosis meta-analysis",
          url: "https://pubmed.ncbi.nlm.nih.gov/d2/",
          published: "2026-02-15",
          snippet: "dx meta abstract",
          evidenceLevel: "synthesis",
        },
        {
          id: "d3",
          title: "Diagnosis biomarker study",
          url: "https://pubmed.ncbi.nlm.nih.gov/d3/",
          published: "2026-02-20",
          snippet: "dx biomarker abstract",
          evidenceLevel: "exploratory",
        },
      ],
    },
    {
      id: "treatment",
      title: "Treatment",
      summary: "tx summary",
      articles: [],
    },
    {
      id: "prevention",
      title: "Prevention",
      summary: "prev summary",
      articles: [],
    },
  ],
};

function renderAt(path: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<p>landing</p>} />
      <Route path="/category/:id" element={<CategoryPage />} />
    </Routes>,
    { initialEntries: [path] },
  );
}

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CategoryPage", () => {
  it("renders the category title, state-of-field summary, and cited reviews", async () => {
    renderAt("/category/diagnosis");

    expect(
      screen.getByRole("heading", { level: 1, name: /^diagnosis$/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /the state of the research right now/i }),
    ).toBeVisible();

    // The synthesis reviews document the summary in the "Documented by" list.
    await waitFor(() =>
      expect(screen.getByText(/documented by/i)).toBeVisible(),
    );
    expect(screen.getByText("Diagnosis systematic review")).toBeVisible();
  });

  it("ranks reviews as citations and lower-evidence studies as important research", async () => {
    renderAt("/category/diagnosis");
    expect(
      await screen.findByRole("heading", { name: /most important research/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /latest research/i }),
    ).toBeVisible();
    // The exploratory study is not review-grade, so it lands in "important",
    // not the citation strip.
    expect(screen.getByText("Diagnosis biomarker study")).toBeVisible();
  });

  it("redirects to landing page for unknown category ids", () => {
    renderAt("/category/does-not-exist");

    expect(screen.getByText("landing")).toBeInTheDocument();
  });

  it("shows empty message when the category has no articles", async () => {
    renderAt("/category/treatment");

    await waitFor(() =>
      expect(screen.getByText(/no further studies indexed yet/i)).toBeVisible(),
    );
  });

  it("renders the cure category from authored content, resolving cross-category studies", async () => {
    renderAt("/category/cure");

    expect(
      screen.getByRole("heading", { level: 1, name: /cure research/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /the state of the research right now/i }),
    ).toBeVisible();
  });
});
