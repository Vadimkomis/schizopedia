import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EvidenceLegend } from "./EvidenceLegend";

describe("EvidenceLegend", () => {
  it("explains all three evidence levels", () => {
    render(<EvidenceLegend />);

    expect(
      screen.getByRole("heading", { name: /how to read the evidence badges/i }),
    ).toBeVisible();
    expect(screen.getByText("Higher-level synthesis")).toBeVisible();
    expect(screen.getByText("Clinical evidence")).toBeVisible();
    expect(screen.getByText("Early-stage evidence")).toBeVisible();
  });

  it("describes how each level should be weighed", () => {
    render(<EvidenceLegend />);

    expect(screen.getByText(/meta-analyses and systematic reviews/i)).toBeVisible();
    expect(screen.getByText(/trials and observational studies/i)).toBeVisible();
    expect(screen.getByText(/not yet settled science/i)).toBeVisible();
  });
});
