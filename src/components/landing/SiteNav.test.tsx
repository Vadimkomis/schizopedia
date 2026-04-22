import { render, screen } from "@testing-library/react";
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
});
