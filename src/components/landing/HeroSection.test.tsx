import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./HeroSection";
import { renderWithRouter } from "@/test/render";

describe("HeroSection", () => {
  it("renders the primary headline and CTAs", () => {
    renderWithRouter(
      <HeroSection totalArticles={30} lastUpdated="2026-06-01T09:00:00Z" />,
    );

    expect(
      screen.getByRole("heading", {
        name: /when schizophrenia touches someone you love, start here\./i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /start here/i }),
    ).toHaveAttribute("href", "/#start-here");
    expect(
      screen.getByRole("link", { name: /explore research/i }),
    ).toHaveAttribute("href", "/#highlights");
  });

  it("shows the indexed studies count in the stats band", () => {
    renderWithRouter(
      <HeroSection totalArticles={18} lastUpdated="2026-06-01T09:00:00Z" />,
    );
    expect(screen.getAllByText("18").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/peer-reviewed studies indexed/i).length,
    ).toBeGreaterThan(0);
  });

  it("shows honest refresh stats instead of a synthetic progress metric", () => {
    renderWithRouter(
      <HeroSection totalArticles={18} lastUpdated="2026-06-01T09:00:00Z" />,
    );
    expect(screen.getByText(/automatic pubmed refresh/i)).toBeVisible();
    expect(screen.getByText(/linked to primary sources/i)).toBeVisible();
    expect(screen.queryByText(/research progress/i)).not.toBeInTheDocument();
  });

  it("falls back to a pending label when the feed has not synced", () => {
    renderWithRouter(<HeroSection totalArticles={0} lastUpdated={null} />);
    expect(screen.getByText(/pending sync/i)).toBeVisible();
  });
});
