import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrevalencePage } from "./PrevalencePage";
import { renderWithProviders } from "@/test/render";

describe("PrevalencePage", () => {
  it("renders the worldwide prevalence page with its hero and data", () => {
    renderWithProviders(<PrevalencePage />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /schizophrenia around the world/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /estimated prevalence by country/i }),
    ).toBeVisible();
  });
});
