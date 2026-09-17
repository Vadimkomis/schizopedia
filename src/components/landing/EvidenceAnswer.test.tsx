import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EvidenceAnswer } from "./EvidenceAnswer";
import { renderWithRouter } from "@/test/render";
import type { EvidenceSynthesis } from "@/lib/evidenceSearch";

const matched: EvidenceSynthesis = {
  answer: "The strongest match is a systematic review examining medication adherence.",
  directMatch: true,
  signal: "Synthesis-led",
  signalDetail: "1 review among the strongest matches",
  matches: [
    {
      score: 12,
      category: { id: "treatment", title: "Treatment" },
      article: {
        id: "review",
        title: "Medication adherence review",
        url: "https://pubmed.ncbi.nlm.nih.gov/review/",
        journal: "JAMA Psychiatry",
        studyType: "Systematic review",
        published: "2026-07-12",
      },
    },
  ],
};

describe("EvidenceAnswer", () => {
  it("announces, focuses, and cites a matched result", async () => {
    const { rerender } = renderWithRouter(
      <EvidenceAnswer query="medication adherence" synthesis={matched} />,
    );

    const heading = screen.getByRole("heading", {
      name: /evidence for “medication adherence”/i,
    });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading.closest("section")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Synthesis-led")).toBeVisible();
    expect(
      screen.getByText(
        "The strongest match is a systematic review examining medication adherence.",
      ),
    ).toBeVisible();
    expect(screen.getByText("1 review among the strongest matches")).toBeVisible();
    expect(screen.getByText(/JAMA Psychiatry/)).toBeVisible();
    expect(screen.getByText(/Systematic review/)).toBeVisible();
    expect(screen.getByText(/Jul 12, 2026/)).toBeVisible();
    const citations = screen.getByRole("list");
    expect(citations.tagName).toBe("OL");
    expect(within(citations).getAllByRole("listitem")).toHaveLength(1);
    expect(within(citations).getByText("1")).toBeVisible();
    const source = screen.getByRole("link", { name: /medication adherence review/i });
    expect(source).toHaveAttribute("target", "_blank");
    expect(source).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText(/not medical advice/i)).toBeVisible();

    source.focus();
    expect(source).toHaveFocus();
    rerender(<EvidenceAnswer query="continuity of care" synthesis={matched} />);

    const updatedHeading = screen.getByRole("heading", {
      name: /evidence for “continuity of care”/i,
    });
    await waitFor(() => expect(updatedHeading).toHaveFocus());
  });

  it("offers four existing collections for a no-match result", () => {
    renderWithRouter(
      <EvidenceAnswer
        query="housing policy"
        synthesis={{
          answer: "The current index has no close source match.",
          directMatch: false,
          matches: [],
          signal: "No direct match",
          signalDetail: "Try another research topic.",
        }}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: /browse evidence topics/i,
    });
    const links = within(navigation).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(within(navigation).getByRole("link", { name: /cure research/i })).toHaveAttribute(
      "href",
      "/category/cure",
    );
    expect(within(navigation).getByRole("link", { name: /^diagnosis$/i })).toHaveAttribute(
      "href",
      "/category/diagnosis",
    );
    expect(within(navigation).getByRole("link", { name: /^treatment$/i })).toHaveAttribute(
      "href",
      "/category/treatment",
    );
    expect(
      within(navigation).getByRole("link", {
        name: /prevention and early support/i,
      }),
    ).toHaveAttribute("href", "/category/prevention");
    expect(screen.queryByRole("heading", { name: /sources/i })).not.toBeInTheDocument();
  });
});
