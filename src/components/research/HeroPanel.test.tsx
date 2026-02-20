import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Tabs } from "@/components/ui/tabs";
import { HeroPanel } from "./HeroPanel";

const categories = [
  { id: "diagnosis", title: "Diagnosis", summary: "s", articles: [] },
  { id: "treatment", title: "Treatment", summary: "s", articles: [] },
  { id: "prevention", title: "Prevention", summary: "s", articles: [] },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe("HeroPanel", () => {
  it("renders heading and description", () => {
    renderWithTheme(
      <Tabs defaultValue="diagnosis">
        <HeroPanel
          lastUpdated="January 1, 2024"
          totalArticles={15}
          sourceLabel="PubMed (NIH)"
          categories={categories}
        />
      </Tabs>,
    );

    expect(
      screen.getByRole("heading", { name: /Schizopedia/i }),
    ).toBeVisible();
    expect(
      screen.getByText(/A clear guide to the latest schizophrenia research/i),
    ).toBeVisible();
  });

  it("renders stat pills with correct values", () => {
    renderWithTheme(
      <Tabs defaultValue="diagnosis">
        <HeroPanel
          lastUpdated="January 1, 2024"
          totalArticles={15}
          sourceLabel="PubMed (NIH)"
          categories={categories}
        />
      </Tabs>,
    );

    expect(screen.getByText("January 1, 2024")).toBeVisible();
    expect(screen.getByText("15")).toBeVisible();
  });

  it("renders tab triggers for all categories", () => {
    renderWithTheme(
      <Tabs defaultValue="diagnosis">
        <HeroPanel
          lastUpdated="Pending"
          totalArticles={0}
          sourceLabel="PubMed"
          categories={categories}
        />
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "Diagnosis" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Treatment" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Prevention" })).toBeVisible();
  });

  it("shows 0 when no articles", () => {
    renderWithTheme(
      <Tabs defaultValue="diagnosis">
        <HeroPanel
          lastUpdated="Pending"
          totalArticles={0}
          sourceLabel="PubMed"
          categories={categories}
        />
      </Tabs>,
    );

    expect(screen.getByText("0")).toBeVisible();
  });
});
