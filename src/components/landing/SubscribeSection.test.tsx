import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubscribeSection } from "./SubscribeSection";

describe("SubscribeSection", () => {
  it("pitches the real Monday refresh cadence", () => {
    render(<SubscribeSection />);

    expect(
      screen.getByRole("heading", { name: /new research lands every monday/i }),
    ).toBeVisible();
    expect(screen.getByText(/refreshes automatically from pubmed/i)).toBeVisible();
  });

  it("contains the subscribe form", () => {
    render(<SubscribeSection />);
    expect(screen.getByLabelText(/email address/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });
});
