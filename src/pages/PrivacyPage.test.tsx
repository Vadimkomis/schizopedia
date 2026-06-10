import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PrivacyPage } from "./PrivacyPage";

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ lastUpdated: null, categories: [] }),
  }),
);

describe("PrivacyPage", () => {
  it("renders the privacy policy headline and key sections", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <PrivacyPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /privacy policy/i }),
    ).toBeVisible();
    expect(screen.getByText(/does not require an account/i)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /local storage/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /info@myclok\.com/i }),
    ).toHaveAttribute("href", "mailto:info@myclok.com");
  });
});
