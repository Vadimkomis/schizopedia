import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./HeroSection";
import { renderWithRouter } from "@/test/render";
import type { ResearchCategory } from "@/lib/types";

const categories: ResearchCategory[] = [
  {
    id: "treatment",
    title: "Treatment",
    summary: "Medication and treatment research.",
    articles: [
      {
        id: "adherence",
        title: "Medication adherence in community care: A systematic review.",
        url: "https://pubmed.ncbi.nlm.nih.gov/adherence/",
        journal: "Journal of health psychology",
        studyType: "Systematic review",
        evidenceLevel: "synthesis",
        published: "2026 Jul 12",
        snippet:
          "Medication nonadherence is common and is associated with poor clinical outcomes.",
      },
      {
        id: "weight",
        title:
          "Weight reduction for people treated with antipsychotics: A network meta-analysis.",
        url: "https://pubmed.ncbi.nlm.nih.gov/weight/",
        journal: "JAMA Psychiatry",
        studyType: "Systematic review",
        evidenceLevel: "synthesis",
        published: "2026 Jul 8",
      },
    ],
  },
];

function renderHero(totalArticles = 30, lastUpdated: string | null = "2026-06-01T09:00:00Z") {
  return renderWithRouter(
    <HeroSection
      categories={categories}
      totalArticles={totalArticles}
      lastUpdated={lastUpdated}
    />,
  );
}

describe("HeroSection", () => {
  it("renders the primary headline and evidence search", () => {
    renderHero();

    expect(
      screen.getByRole("heading", {
        name: /ask a hard question\. see the evidence clearly\./i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("search", { name: /schizopedia evidence search/i }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /synthesize/i })).toBeVisible();
  });

  it("shows the indexed studies count in the stats band", () => {
    renderHero(18);
    expect(screen.getAllByText("18").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/studies in the live index/i).length,
    ).toBeGreaterThan(0);
  });

  it("shows honest refresh stats instead of a synthetic progress metric", () => {
    renderHero(18);
    expect(screen.getByText(/automatic pubmed refresh/i)).toBeVisible();
    expect(screen.getByText(/linked to primary sources/i)).toBeVisible();
    expect(screen.queryByText(/research progress/i)).not.toBeInTheDocument();
  });

  it("synthesizes a new question and keeps the matching citation visible", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.type(
      screen.getByRole("textbox", {
        name: /ask a question about schizophrenia research/i,
      }),
      "What helps with antipsychotic weight gain?",
    );
    await user.click(screen.getByRole("button", { name: /synthesize/i }));

    expect(
      screen.getByRole("heading", {
        name: /what helps with antipsychotic weight gain/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /weight reduction for people/i }),
    ).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/weight/");
  });

  it("falls back to a pending label when the feed has not synced", () => {
    renderHero(0, null);
    expect(screen.getByText(/pending sync/i)).toBeVisible();
  });
});
