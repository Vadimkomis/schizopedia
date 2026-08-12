import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EvidenceSearchForm } from "./EvidenceSearchForm";
import { renderWithRouter } from "@/test/render";

describe("EvidenceSearchForm", () => {
  it("keeps submission disabled until the trimmed question has content", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={vi.fn()} />,
    );

    const button = screen.getByRole("button", { name: /search evidence/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "medication adherence");
    expect(button).toBeEnabled();
  });

  it("submits a trimmed question with Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByRole("textbox"), "  family support{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("family support");
  });

  it("inserts a newline and does not submit with Shift+Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={onSubmit} />,
    );

    const field = screen.getByRole("textbox");
    await user.type(field, "family{Shift>}{Enter}{/Shift}support");
    expect(field).toHaveValue("family\nsupport");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the loading label and blocks submission", () => {
    renderWithRouter(
      <EvidenceSearchForm loading disabled onSubmit={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: /loading index/i })).toBeDisabled();
  });
});
