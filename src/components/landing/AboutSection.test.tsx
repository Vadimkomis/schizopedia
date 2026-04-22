import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "./AboutSection";

describe("AboutSection", () => {
  it("renders the about eyebrow and headline", () => {
    render(<AboutSection />);

    expect(screen.getByText(/about schizopedia/i)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /making research accessible\. empowering minds\./i,
      }),
    ).toBeVisible();
  });

  it("renders all three value props", () => {
    render(<AboutSection />);

    expect(screen.getByText(/evidence-based/i)).toBeVisible();
    expect(screen.getByText(/accessible for all/i)).toBeVisible();
    expect(screen.getByText(/independent & trusted/i)).toBeVisible();
  });
});
