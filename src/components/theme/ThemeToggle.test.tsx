import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
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

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
