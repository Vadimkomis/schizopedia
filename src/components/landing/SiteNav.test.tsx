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

  it("links to the primary landing-page experiences", () => {
    renderWithProviders(<SiteNav />);

    expect(
      screen.getByRole("link", { name: "Ask AI" }),
    ).toHaveAttribute("href", "/#ask");
    expect(
      screen.getByRole("link", { name: "Guides" }),
    ).toHaveAttribute("href", "/#start-here");
    expect(
      screen.getByRole("link", { name: "Evidence" }),
    ).toHaveAttribute("href", "/#categories");
  });

  it("renders a support button linking to the in-app donate page", () => {
    renderWithProviders(<SiteNav />);

    const support = screen.getByRole("link", { name: /support us/i });
    expect(support).toHaveAttribute("href", "/donate");
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

    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = within(
      screen.getByRole("navigation", { name: "Mobile" }),
    );
    expect(mobileNav.getByRole("link", { name: "Ask AI" })).toBeVisible();
    expect(mobileNav.getByRole("link", { name: "Evidence" })).toBeVisible();
    expect(
      mobileNav.getByRole("button", { name: /toggle theme/i }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
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
        { name: "Evidence" },
      ),
    );
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });
});
