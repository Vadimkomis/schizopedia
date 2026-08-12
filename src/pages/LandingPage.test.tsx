import { screen, waitFor, within } from "@testing-library/react";
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
  globalThis.__RESEARCH__ = null;
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  } as Response);
});

afterEach(() => {
  globalThis.__RESEARCH__ = undefined;
  vi.restoreAllMocks();
});

describe("LandingPage", () => {
  it("renders search, four topics, latest studies, and footer only", async () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: /what would you like to understand/i }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: /^topics$/i })).toBeVisible();
    const topics = within(screen.getByRole("region", { name: /^topics$/i }));
    expect(topics.getAllByRole("link")).toHaveLength(4);

    await waitFor(() => expect(screen.getByText("Recent treatment advance")).toBeVisible());
    expect(screen.getByText("Recent diagnosis advance")).toBeVisible();
    expect(screen.getByText(/knowledge today\. better tomorrows\./i)).toBeVisible();

    expect(screen.queryByText(/one question, every source in view/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/new to all of this/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/making research accessible/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/around the world/i)).not.toBeInTheDocument();
  });

  it("keeps topics usable when the research feed fails", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("offline"));
    renderPage();

    expect(await screen.findByText(/search index unavailable/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
    expect(screen.getByRole("link", { name: /cure research/i })).toBeVisible();
    expect(screen.getByText(/no studies are available yet/i)).toBeVisible();
  });
});
