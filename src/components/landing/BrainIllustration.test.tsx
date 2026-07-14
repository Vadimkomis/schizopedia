import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrainIllustration } from "./BrainIllustration";

describe("BrainIllustration", () => {
  it("presents the aerial brain scene and uses the matching SVG artwork", () => {
    const { container } = render(<BrainIllustration />);

    expect(
      screen.getByRole("img", {
        name: /aerial, isometric brain.*knowledge landscape/i,
      }),
    ).toBeInTheDocument();

    const scene = container.querySelector('img[src="/brain-aerial.svg"]');
    expect(scene).toHaveAttribute("aria-hidden", "true");
    expect(scene).toHaveAttribute("width", "800");
    expect(scene).toHaveAttribute("height", "620");
    expect(container.querySelector('img[src="/hero-brain.jpg"]')).toBeNull();
  });
});
