import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HeroPanel } from "./HeroPanel";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe("HeroPanel", () => {
  it("renders heading and description", () => {
    renderWithTheme(
      <HeroPanel
        lastUpdated="January 1, 2024"
        totalArticles={15}
        categoryCount={3}
        sourceLabel="PubMed (NIH)"
      />,
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
      <HeroPanel
        lastUpdated="January 1, 2024"
        totalArticles={15}
        categoryCount={3}
        sourceLabel="PubMed (NIH)"
      />,
    );

    expect(screen.getByText("January 1, 2024")).toBeVisible();
    expect(screen.getByText("15")).toBeVisible();
    expect(screen.getByText("3")).toBeVisible();
  });

  it("renders 'Research Directory' badge", () => {
    renderWithTheme(
      <HeroPanel
        lastUpdated="Pending"
        totalArticles={0}
        categoryCount={3}
        sourceLabel="PubMed"
      />,
    );

    expect(screen.getByText("Research Directory")).toBeVisible();
  });

  it("shows 0 when no articles", () => {
    renderWithTheme(
      <HeroPanel
        lastUpdated="Pending"
        totalArticles={0}
        categoryCount={3}
        sourceLabel="PubMed"
      />,
    );

    expect(screen.getByText("0")).toBeVisible();
  });
});
