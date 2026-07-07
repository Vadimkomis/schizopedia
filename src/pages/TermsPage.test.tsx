import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { TermsPage } from "./TermsPage";

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ lastUpdated: null, categories: [] }),
  }),
);

describe("TermsPage", () => {
  it("renders the terms headline and the medical disclaimer", () => {
    renderWithProviders(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: /terms & conditions/i }),
    ).toBeVisible();
    expect(screen.getByText(/nothing on this site is medical advice/i)).toBeVisible();
    expect(screen.getByText(/988/)).toBeVisible();
    expect(screen.getByText(/labels are generated automatically/i)).toBeVisible();
  });
});
