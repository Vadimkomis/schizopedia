import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./HeroSection";

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("HeroSection", () => {
  it("renders the primary headline and CTAs", () => {
    wrap(<HeroSection researchProgress={78} totalArticles={30} />);

    expect(
      screen.getByRole("heading", {
        name: /understand the latest research on schizophrenia/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /explore research/i }),
    ).toHaveAttribute("href", "/#highlights");
    expect(
      screen.getByRole("link", { name: /learn more/i }),
    ).toHaveAttribute("href", "/#about");
  });

  it("shows the research progress value", () => {
    wrap(<HeroSection researchProgress={42} totalArticles={18} />);
    expect(screen.getByText("42%")).toBeVisible();
  });
});
