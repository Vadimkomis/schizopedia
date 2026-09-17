import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts in light mode for a new visitor even when their system uses dark mode", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    renderToggle();

    expect(document.documentElement).not.toHaveClass("dark");
  });

  it.each(["light", "dark"])("restores the visitor's saved %s appearance", (theme) => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    localStorage.setItem("schizopedia-theme", theme);
    renderToggle();

    expect(document.documentElement.classList.contains("dark")).toBe(theme === "dark");
  });

  it("renders an icon-only button without a text label", () => {
    renderToggle();

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeVisible();
    expect(button).not.toHaveTextContent(/light|dark/i);
  });

  it("toggles the theme on click", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("schizopedia-theme")).toBe("dark");

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("schizopedia-theme")).toBe("light");
  });
});
