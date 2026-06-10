import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
    render(
      <ThemeProvider>
        <MemoryRouter>
          <TermsPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /terms & conditions/i }),
    ).toBeVisible();
    expect(screen.getByText(/nothing on this site is medical advice/i)).toBeVisible();
    expect(screen.getByText(/988/)).toBeVisible();
    expect(screen.getByText(/labels are generated automatically/i)).toBeVisible();
  });
});
