import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LandingPage } from "./LandingPage";
import { renderWithProviders } from "@/test/render";
import type { ResearchPayload } from "@/lib/types";

const payload: ResearchPayload = {
  lastUpdated: "2026-03-01T00:00:00.000Z",
  categories: [
    {
      id: "diagnosis",
      title: "Diagnosis",
      summary: "Learn about diagnosis",
      articles: [
        {
          id: "a1",
          title: "Recent diagnosis advance",
          url: "https://pubmed.ncbi.nlm.nih.gov/a1/",
          published: "2026-02-10",
          snippet: "Abstract snippet one.",
        },
      ],
    },
    {
      id: "treatment",
      title: "Treatment",
      summary: "Explore treatments",
      articles: [
        {
          id: "a2",
          title: "Recent treatment advance",
          url: "https://pubmed.ncbi.nlm.nih.gov/a2/",
          published: "2026-02-20",
          snippet: "Abstract snippet two.",
        },
      ],
    },
    {
      id: "prevention",
      title: "Prevention",
      summary: "Prevention strategies",
      articles: [],
    },
  ],
};

function renderPage() {
  return renderWithProviders(<LandingPage />, { initialEntries: ["/"] });
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

describe("LandingPage", () => {
  it("renders hero, four category cards, highlights, and footer", async () => {
    renderPage();

    // Hero
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /when schizophrenia touches someone you love, start here\./i,
      }),
    ).toBeVisible();

    // Start-here guide cards
    expect(
      screen.getByRole("heading", {
        name: /new to all of this\? you're in the right place\./i,
      }),
    ).toBeVisible();

    // Four category cards (Cure + 3 from data)
    expect(
      screen.getByRole("heading", { level: 3, name: /cure research/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: /^diagnosis$/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: /^treatment$/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: /^prevention$/i }),
    ).toBeVisible();

    // After fetch resolves, highlights render real titles
    await waitFor(() =>
      expect(screen.getByText("Recent treatment advance")).toBeVisible(),
    );
    expect(screen.getByText("Recent diagnosis advance")).toBeVisible();

    // Footer tagline
    expect(
      screen.getByText(/knowledge today\. better tomorrows\./i),
    ).toBeVisible();
  });
});
