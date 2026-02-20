import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ArticleCard } from "./ArticleCard";
import type { ResearchArticle } from "@/lib/types";

const fullArticle: ResearchArticle = {
  id: "100",
  title: "Brain imaging in early psychosis",
  journal: "Nature Neuroscience",
  published: "2024",
  url: "https://pubmed.ncbi.nlm.nih.gov/100/",
  authors: ["Doe J", "Smith A"],
  snippet: "A comprehensive study on brain imaging techniques.",
};

const minimalArticle: ResearchArticle = {
  id: "200",
  title: "Minimal article",
  url: "https://pubmed.ncbi.nlm.nih.gov/200/",
};

const wrap = (ui: React.ReactElement) =>
  render(<ul>{ui}</ul>);

describe("ArticleCard", () => {
  it("renders title, meta, and snippet", () => {
    wrap(<ArticleCard article={fullArticle} />);

    expect(screen.getByText("Brain imaging in early psychosis")).toBeVisible();
    expect(screen.getByText(/Nature Neuroscience/)).toBeVisible();
    expect(
      screen.getByText("A comprehensive study on brain imaging techniques."),
    ).toBeVisible();
  });

  it("renders link with correct attributes", () => {
    wrap(<ArticleCard article={fullArticle} />);

    const link = screen
      .getByText("Brain imaging in early psychosis")
      .closest("a");
    expect(link).toHaveAttribute(
      "href",
      "https://pubmed.ncbi.nlm.nih.gov/100/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("shows fallback when snippet is missing", () => {
    wrap(<ArticleCard article={minimalArticle} />);

    expect(screen.getByText("View full article on PubMed")).toBeVisible();
  });

  it("hides decorative dot from screen readers", () => {
    const { container } = wrap(<ArticleCard article={fullArticle} />);

    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });
});
