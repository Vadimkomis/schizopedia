import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DonatePage } from "./DonatePage";
import { renderWithProviders } from "@/test/render";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("DonatePage", () => {
  it("uses Schizopedia's Stripe checkout without deployment-specific configuration", () => {
    vi.stubEnv("VITE_DONATE_URL", undefined);

    renderWithProviders(<DonatePage />);

    expect(screen.getByRole("link", { name: /donate now/i })).toHaveAttribute(
      "href",
      "https://buy.stripe.com/aFa7sNfjQ86C1vcaXJaR200",
    );
    expect(screen.queryByText(/launching soon/i)).not.toBeInTheDocument();
  });

  it("shows a working contact CTA when no payment processor is configured", () => {
    vi.stubEnv("VITE_DONATE_URL", "");

    renderWithProviders(<DonatePage />);

    const cta = screen.getByRole("link", { name: /get in touch to contribute/i });
    expect(cta).toHaveAttribute("href", expect.stringContaining("mailto:"));
    expect(screen.getByText(/launching soon/i)).toBeVisible();
    // No dead external link.
    expect(
      screen.queryByRole("link", { name: /donate now/i }),
    ).not.toBeInTheDocument();
  });

  it("shows an outbound donate button when a processor URL is set", () => {
    vi.stubEnv("VITE_DONATE_URL", "https://example.org/give");

    renderWithProviders(<DonatePage />);

    const donate = screen.getByRole("link", { name: /donate now/i });
    expect(donate).toHaveAttribute("href", "https://example.org/give");
    expect(donate).toHaveAttribute("target", "_blank");
    expect(donate).toHaveAttribute("rel", "noreferrer noopener");
  });
});
