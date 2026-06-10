import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SiteNav } from "./SiteNav";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function wrap(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
}

describe("SiteNav", () => {
  it("renders the wordmark linking to root", () => {
    wrap(<SiteNav />);

    const brand = screen.getByRole("link", { name: /schizopedia/i });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("lists the primary category nav links", () => {
    wrap(<SiteNav />);

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

  it("renders a donate button that opens externally", () => {
    wrap(<SiteNav />);

    const donate = screen.getByRole("link", { name: /donate/i });
    expect(donate).toHaveAttribute("href", expect.stringContaining("https://"));
    expect(donate).toHaveAttribute("target", "_blank");
    expect(donate).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("does not include a Start Here nav link (the wordmark is the home affordance)", () => {
    wrap(<SiteNav />);
    expect(
      screen.queryByRole("link", { name: /start here/i }),
    ).not.toBeInTheDocument();
  });

  it("toggles the mobile menu with the nav links and theme control", async () => {
    const user = userEvent.setup();
    wrap(<SiteNav />);

    expect(
      screen.queryByRole("navigation", { name: "Mobile" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = within(
      screen.getByRole("navigation", { name: "Mobile" }),
    );
    expect(mobileNav.getByRole("link", { name: "Research" })).toBeVisible();
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
    wrap(<SiteNav />);

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
