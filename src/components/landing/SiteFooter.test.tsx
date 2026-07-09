import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";
import { renderWithRouter } from "@/test/render";

describe("SiteFooter", () => {
  it("renders the tagline", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.getByText(/knowledge today\. better tomorrows\./i)).toBeVisible();
  });

  it("links privacy and terms pages", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.getByRole("link", { name: /privacy/i })).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toHaveAttribute("href", "/terms");
  });

  it("links the donate page", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.getByRole("link", { name: /donate/i })).toHaveAttribute(
      "href",
      "/donate",
    );
  });

  it("links the worldwide prevalence page", () => {
    renderWithRouter(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: /worldwide data/i }),
    ).toHaveAttribute("href", "/prevalence");
  });

  it("no longer renders an email subscribe field", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /subscribe/i }),
    ).not.toBeInTheDocument();
  });
});
