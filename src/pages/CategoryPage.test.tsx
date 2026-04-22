import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryPage } from "./CategoryPage";
import { LandingPage } from "./LandingPage";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
          title: "Diagnosis article",
          url: "https://pubmed.ncbi.nlm.nih.gov/d1/",
          published: "2026-02-10",
          snippet: "dx abstract",
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
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
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
  it("renders the category title, summary, and article list", async () => {
    renderAt("/category/diagnosis");

    expect(
      screen.getByRole("heading", { level: 1, name: /^diagnosis$/i }),
    ).toBeVisible();

    await waitFor(() =>
      expect(screen.getByText("Diagnosis article")).toBeVisible(),
    );
  });

  it("redirects to landing page for unknown category ids", () => {
    renderAt("/category/does-not-exist");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /understand the latest research on schizophrenia/i,
      }),
    ).toBeVisible();
  });

  it("shows empty message when the category has no articles", async () => {
    renderAt("/category/treatment");

    await waitFor(() =>
      expect(screen.getByText(/no articles indexed/i)).toBeVisible(),
    );
  });
});
