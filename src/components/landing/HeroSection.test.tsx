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

function renderHero(
  props: Partial<React.ComponentProps<typeof HeroSection>> = {},
) {
  return renderWithRouter(
    <HeroSection categories={categories} loading={false} error={null} {...props} />,
  );
}

describe("HeroSection", () => {
  it("starts with one evidence-search action and no answer", () => {
    renderHero();

    expect(
      screen.getByRole("heading", { name: /what would you like to understand/i }),
    ).toBeVisible();
    expect(
      screen.getByText(/independent · source-linked · updated weekly/i),
    ).toBeVisible();
    expect(
      screen.getByRole("search", { name: /schizopedia evidence search/i }),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
    expect(screen.queryByText(/evidence for “/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/studies in the live index/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/one question, every source in view/i),
    ).not.toBeInTheDocument();
  });

  it("renders a matching inline answer and leaves it visible while editing", async () => {
    const user = userEvent.setup();
    renderHero();
    const field = screen.getByRole("textbox");
    await user.type(field, "medication adherence{Enter}");

    const heading = screen.getByRole("heading", {
      name: /evidence for “medication adherence”/i,
    });
    expect(heading).toHaveFocus();
    expect(
      screen.getByRole("link", { name: /medication adherence in community care/i }),
    ).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/adherence/");

    await user.clear(field);
    await user.type(field, "family support");
    expect(heading).toBeVisible();
  });

  it("moves focus after resubmitting the same question", async () => {
    const user = userEvent.setup();
    renderHero();
    const field = screen.getByRole("textbox");
    await user.type(field, "medication adherence{Enter}");
    await user.click(field);
    expect(field).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("heading", {
        name: /evidence for “medication adherence”/i,
      }),
    ).toHaveFocus();
  });

  it("disables the form while the index is loading", () => {
    renderHero({ loading: true });
    expect(screen.getByRole("button", { name: /loading index/i })).toBeDisabled();
  });

  it("keeps browse guidance visible when the feed fails", () => {
    renderHero({ error: "network failed" });
    expect(screen.getByText(/search index unavailable/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
    expect(screen.getByText(/browse topics below/i)).toBeVisible();
  });
});
