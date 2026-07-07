import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GUIDES } from "@/lib/guides";
import { StartHereSection } from "./StartHereSection";
import { renderWithRouter } from "@/test/render";

function renderSection() {
  return renderWithRouter(<StartHereSection />);
}

describe("StartHereSection", () => {
  it("renders the caregiver-focused heading", () => {
    renderSection();
    expect(
      screen.getByRole("heading", {
        name: /new to all of this\? you're in the right place\./i,
      }),
    ).toBeVisible();
  });

  it("renders a card linking to every guide", () => {
    renderSection();
    for (const guide of GUIDES) {
      const card = screen.getByRole("link", {
        name: new RegExp(guide.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      });
      expect(card).toHaveAttribute("href", `/guide/${guide.id}`);
    }
  });

  it("shows reading time on each card", () => {
    renderSection();
    expect(screen.getAllByText(/min read/i)).toHaveLength(GUIDES.length);
  });
});
