import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LatestHighlights, formatPublishedShort } from "./LatestHighlights";
import { renderWithRouter } from "@/test/render";
import type { ResearchCategory } from "@/lib/types";

const categories: ResearchCategory[] = [
  {
    id: "diagnosis",
    title: "Diagnosis",
    summary: "dx",
    articles: [
      {
        id: "1",
        title: "Oldest diagnosis article",
        url: "https://pubmed.ncbi.nlm.nih.gov/1/",
        published: "2022",
      },
      {
        id: "2",
        title: "Newest diagnosis article",
        url: "https://pubmed.ncbi.nlm.nih.gov/2/",
        published: "2026-03-12",
      },
    ],
  },
  {
    id: "treatment",
    title: "Treatment",
    summary: "tx",
    articles: [
      {
        id: "3",
        title: "Middle treatment article",
        url: "https://pubmed.ncbi.nlm.nih.gov/3/",
        published: "2024-06-01",
      },
    ],
  },
];

describe("LatestHighlights", () => {
  it("picks the 3 most recent articles across categories", () => {
    renderWithRouter(<LatestHighlights categories={categories} loading={false} />);

    expect(screen.getByText("Newest diagnosis article")).toBeVisible();
    expect(screen.getByText("Middle treatment article")).toBeVisible();
    expect(screen.getByText("Oldest diagnosis article")).toBeVisible();

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Newest diagnosis article");
    expect(headings[1]).toHaveTextContent("Middle treatment article");
    expect(headings[2]).toHaveTextContent("Oldest diagnosis article");
  });

  it("renders skeletons while loading with no data", () => {
    const { container } = renderWithRouter(
      <LatestHighlights categories={[]} loading={true} />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBe(3);
  });

  it("shows empty message when no articles exist and not loading", () => {
    renderWithRouter(
      <LatestHighlights
        categories={[
          { id: "diagnosis", title: "Diagnosis", summary: "dx", articles: [] },
        ]}
        loading={false}
      />,
    );

    expect(
      screen.getByText(/no articles available/i),
    ).toBeVisible();
  });
});

describe("formatPublishedShort", () => {
  it("formats ISO dates as 'MMM d, yyyy'", () => {
    expect(formatPublishedShort("2026-03-12")).toMatch(/Mar\s+12,\s+2026/);
  });

  it("extracts the year from free-form strings", () => {
    expect(formatPublishedShort("Winter 2024 edition")).toBe("2024");
  });

  it("returns null for missing values", () => {
    expect(formatPublishedShort(undefined)).toBeNull();
  });
});
