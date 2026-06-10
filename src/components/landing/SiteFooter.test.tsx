import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("SiteFooter", () => {
  it("renders the tagline", () => {
    wrap(<SiteFooter />);
    expect(screen.getByText(/knowledge today\. better tomorrows\./i)).toBeVisible();
  });

  it("links privacy and terms pages", () => {
    wrap(<SiteFooter />);
    expect(screen.getByRole("link", { name: /privacy/i })).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toHaveAttribute("href", "/terms");
  });

  it("does not render a donate button (donate lives in the nav)", () => {
    wrap(<SiteFooter />);
    expect(
      screen.queryByRole("link", { name: /donate/i }),
    ).not.toBeInTheDocument();
  });

  it("renders a compact email subscribe field", () => {
    wrap(<SiteFooter />);
    expect(screen.getByLabelText(/email address/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });
});
