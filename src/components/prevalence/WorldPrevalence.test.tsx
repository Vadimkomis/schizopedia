import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorldPrevalence } from "./WorldPrevalence";
import { prevalence } from "@/lib/prevalence";

describe("WorldPrevalence", () => {
  it("leads with the global WHO figure and links its source", () => {
    render(<WorldPrevalence />);
    expect(
      screen.getByText(`1 in ${prevalence.global.oneIn}`),
    ).toBeVisible();
    const whoLink = screen.getByRole("link", { name: /World Health Organization/i });
    expect(whoLink).toHaveAttribute("href", prevalence.global.sourceUrl);
  });

  it("renders a row for every country with its percentage", () => {
    render(<WorldPrevalence />);
    const first = prevalence.countries[0];
    expect(screen.getByText(first.name)).toBeVisible();
    // Every country percentage label ends with a percent sign.
    prevalence.countries.forEach((c) => {
      expect(screen.getAllByText(new RegExp(`${c.name}`)).length).toBeGreaterThan(0);
    });
  });

  it("credits the estimates source for country figures", () => {
    render(<WorldPrevalence />);
    const link = screen.getByRole("link", { name: /IHME Global Burden of Disease/i });
    expect(link).toHaveAttribute("href", prevalence.estimatesSource.url);
  });
});
