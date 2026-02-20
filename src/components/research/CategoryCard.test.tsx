import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryCard } from "./CategoryCard";
import type { ResearchCategory } from "@/lib/types";

const accent = {
  light: "from-[#e9f5ff] via-white to-white",
  dark: "dark:from-[#132037] dark:to-[#0a0f1a]",
};

const categoryWithArticles: ResearchCategory = {
  id: "diagnosis",
  title: "Diagnosis",
  summary: "How schizophrenia is identified",
  articles: [
    {
      id: "1",
      title: "Study on biomarkers",
      url: "https://example.com/1",
      journal: "Nature",
      authors: ["Doe"],
      published: "2024",
      snippet: "A study snippet",
    },
    {
      id: "2",
      title: "Imaging techniques review",
      url: "https://example.com/2",
      journal: "Lancet",
      authors: ["Smith"],
      published: "2024",
    },
  ],
};

const emptyCategory: ResearchCategory = {
  id: "treatment",
  title: "Treatment",
  summary: "Current treatments",
  articles: [],
};

describe("CategoryCard", () => {
  it("renders category title and summary", () => {
    render(
      <CategoryCard
        category={categoryWithArticles}
        accent={accent}
        loading={false}
        index={0}
      />,
    );

    expect(screen.getByText("Diagnosis")).toBeVisible();
    expect(screen.getByText("How schizophrenia is identified")).toBeVisible();
  });

  it("renders articles when present", () => {
    render(
      <CategoryCard
        category={categoryWithArticles}
        accent={accent}
        loading={false}
        index={0}
      />,
    );

    expect(screen.getByText("Study on biomarkers")).toBeVisible();
    expect(screen.getByText("Imaging techniques review")).toBeVisible();
    expect(screen.getByText("2 highlighted studies")).toBeVisible();
  });

  it("shows empty state when no articles", () => {
    render(
      <CategoryCard
        category={emptyCategory}
        accent={accent}
        loading={false}
        index={1}
      />,
    );

    expect(
      screen.getByText(/No articles found yet/i),
    ).toBeVisible();
  });

  it("shows coming soon text in description when empty", () => {
    render(
      <CategoryCard
        category={emptyCategory}
        accent={accent}
        loading={false}
        index={1}
      />,
    );

    expect(
      screen.getByText(/Coming soon/i),
    ).toBeVisible();
  });

  it("shows skeleton when loading and no articles", () => {
    const { container } = render(
      <CategoryCard
        category={emptyCategory}
        accent={accent}
        loading={true}
        index={0}
      />,
    );

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });

  it("renders correct index number", () => {
    render(
      <CategoryCard
        category={categoryWithArticles}
        accent={accent}
        loading={false}
        index={2}
      />,
    );

    expect(screen.getByText("03")).toBeVisible();
  });
});
