import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SubscribeForm } from "./SubscribeForm";

describe("SubscribeForm", () => {
  it("renders a labeled email input and subscribe button", () => {
    render(<SubscribeForm />);
    expect(screen.getByLabelText(/email address/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeVisible();
  });

  it("shows a validation error for an invalid email", async () => {
    const user = userEvent.setup();
    render(<SubscribeForm />);

    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /enter a valid email address/i,
    );
  });

  it("clears the error once the user edits the input", async () => {
    const user = userEvent.setup();
    render(<SubscribeForm />);

    await user.type(screen.getByLabelText(/email address/i), "nope");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await user.type(screen.getByLabelText(/email address/i), "x");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the honest launching-soon message after a valid submit", async () => {
    const user = userEvent.setup();
    render(<SubscribeForm />);

    await user.type(
      screen.getByLabelText(/email address/i),
      "reader@example.com",
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/launching soon/i);
    expect(status).toHaveTextContent(/wasn't stored/i);
    expect(
      screen.queryByRole("button", { name: /subscribe/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the visible label in compact mode but keeps it for screen readers", () => {
    render(<SubscribeForm compact />);
    const label = screen.getByText(/email address/i);
    expect(label).toHaveClass("sr-only");
  });
});
