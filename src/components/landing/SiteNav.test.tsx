import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteNav } from "./SiteNav";
import { renderWithProviders } from "@/test/render";

describe("SiteNav", () => {
  it("renders the wordmark linking to root", () => {
    renderWithProviders(<SiteNav />);

    const brand = screen.getByRole("link", { name: /schizopedia/i });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("links to the compact primary destinations", () => {
    renderWithProviders(<SiteNav />);

    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/#topics",
    );
    expect(
      screen.getByRole("link", { name: "Guides" }),
    ).toHaveAttribute("href", "/guide/what-is-schizophrenia");
    expect(
      screen.queryByRole("link", { name: /ask ai|evidence|research/i }),
    ).not.toBeInTheDocument();
  });

  it("renders a Donate button linking to the in-app donate page", () => {
    renderWithProviders(<SiteNav />);

    const donate = screen.getByRole("link", { name: /^donate$/i });
    expect(donate).toHaveAttribute("href", "/donate");
  });

  it("keeps the wordmark as the home affordance", () => {
    renderWithProviders(<SiteNav />);
    expect(screen.getByRole("link", { name: /schizopedia home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("toggles the mobile menu with the nav links and theme control", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteNav />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });

    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileNav = within(
      screen.getByRole("navigation", { name: "Mobile" }),
    );
    expect(mobileNav.getByRole("link", { name: "Browse" })).toBeVisible();
    expect(mobileNav.getByRole("link", { name: "Guides" })).toBeVisible();
    expect(
      mobileNav.getByRole("button", { name: /toggle theme/i }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });

  it("closes the mobile menu after a link is chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteNav />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    await user.click(
      within(screen.getByRole("navigation", { name: "Mobile" })).getByRole(
        "link",
        { name: "Guides" },
      ),
    );
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });
});
