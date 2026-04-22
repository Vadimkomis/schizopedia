import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HighlightCard } from "./HighlightCard";
import type { ResearchArticle } from "@/lib/types";

const article: ResearchArticle = {
  id: "42",
  title: "New Insights into Synaptic Dysfunction in Schizophrenia",
  url: "https://pubmed.ncbi.nlm.nih.gov/42/",
  snippet:
    "A comprehensive study reveals how synaptic dysfunction may contribute to cognitive and emotional symptoms.",
};

describe("HighlightCard", () => {
  it("renders title, snippet, date, and category chip", () => {
    render(
      <HighlightCard
        article={article}
        category={{ id: "diagnosis", title: "Diagnosis" }}
        dateLabel="May 2, 2024"
        variant="neuro"
      />,
    );

    expect(screen.getByText(article.title)).toBeVisible();
    expect(screen.getByText(/comprehensive study reveals/i)).toBeVisible();
    expect(screen.getByText("May 2, 2024")).toBeVisible();
    expect(screen.getByText("Neuroscience")).toBeVisible();
  });

  it("links to pubmed with safe target attributes", () => {
    render(
      <HighlightCard
        article={article}
        category={{ id: "diagnosis", title: "Diagnosis" }}
        dateLabel="May 2, 2024"
        variant="scan"
      />,
    );

    const link = screen.getByRole("link", { name: /read summary/i });
    expect(link).toHaveAttribute("href", article.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("truncates long snippets with an ellipsis", () => {
    const longArticle: ResearchArticle = {
      ...article,
      id: "long",
      snippet: "A".repeat(300),
    };

    render(
      <HighlightCard
        article={longArticle}
        category={{ id: "diagnosis", title: "Diagnosis" }}
        dateLabel="Apr 18, 2024"
        variant="lab"
      />,
    );

    expect(screen.getByText(/A{160}…/)).toBeVisible();
  });
});
