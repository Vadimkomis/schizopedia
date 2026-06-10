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

  it("renders a donate button that opens externally", () => {
    wrap(<SiteFooter />);
    const donate = screen.getByRole("link", { name: /donate/i });
    expect(donate).toHaveAttribute("target", "_blank");
    expect(donate).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("renders a compact email subscribe field", () => {
    wrap(<SiteFooter />);
    expect(screen.getByLabelText(/email address/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });
});
