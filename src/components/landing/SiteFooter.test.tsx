import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";
import { renderWithRouter } from "@/test/render";

describe("SiteFooter", () => {
  it("renders the tagline", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.getByText(/knowledge today\. better tomorrows\./i)).toBeVisible();
  });

  it("renders the compact footer link set", () => {
    renderWithRouter(<SiteFooter />);

    expect(screen.getByRole("link", { name: /^guides$/i })).toHaveAttribute(
      "href",
      "/guide/what-is-schizophrenia",
    );
    expect(screen.getByRole("link", { name: /^prevalence$/i })).toHaveAttribute(
      "href",
      "/prevalence",
    );
    expect(screen.getByRole("link", { name: /^donate$/i })).toHaveAttribute(
      "href",
      "/donate",
    );
    expect(screen.getByRole("link", { name: /privacy/i })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: /^terms$/i })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeVisible();
    expect(
      screen.getByText(/educational information, not medical advice/i),
    ).toBeVisible();
  });

  it("no longer renders an email subscribe field", () => {
    renderWithRouter(<SiteFooter />);
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /subscribe/i }),
    ).not.toBeInTheDocument();
  });
});
