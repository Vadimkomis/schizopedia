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

  it("lists the primary category nav links", () => {
    renderWithProviders(<SiteNav />);

    expect(
      screen.getByRole("link", { name: "Diagnosis" }),
    ).toHaveAttribute("href", "/category/diagnosis");
    expect(
      screen.getByRole("link", { name: "Treatment" }),
    ).toHaveAttribute("href", "/category/treatment");
    expect(
      screen.getByRole("link", { name: "Prevention" }),
    ).toHaveAttribute("href", "/category/prevention");
  });

  it("renders a donate button linking to the in-app donate page", () => {
    renderWithProviders(<SiteNav />);

    const donate = screen.getByRole("link", { name: /donate/i });
    expect(donate).toHaveAttribute("href", "/donate");
  });

  it("links the cure category from the nav", () => {
    renderWithProviders(<SiteNav />);
    expect(screen.getByRole("link", { name: "Cure" })).toHaveAttribute(
      "href",
      "/category/cure",
    );
  });

  it("does not include a Start Here nav link (the wordmark is the home affordance)", () => {
    renderWithProviders(<SiteNav />);
    expect(
      screen.queryByRole("link", { name: /start here/i }),
    ).not.toBeInTheDocument();
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
    expect(mobileNav.getByRole("link", { name: "Cure" })).toBeVisible();
    expect(mobileNav.getByRole("link", { name: "Prevention" })).toBeVisible();
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
        { name: "Diagnosis" },
      ),
    );
    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();
  });
});
