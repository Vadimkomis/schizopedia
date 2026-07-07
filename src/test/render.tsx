import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

interface RouterRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: MemoryRouterProps["initialEntries"];
  withTheme?: boolean;
}

export function renderWithRouter(
  ui: React.ReactElement,
  {
    initialEntries,
    withTheme = false,
    ...options
  }: RouterRenderOptions = {},
) {
  const routed = (
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
  return render(
    withTheme ? <ThemeProvider>{routed}</ThemeProvider> : routed,
    options,
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RouterRenderOptions, "withTheme">,
) {
  return renderWithRouter(ui, { ...options, withTheme: true });
}
