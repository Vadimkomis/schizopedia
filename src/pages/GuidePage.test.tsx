import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { GuidePage } from "./GuidePage";
import { renderWithProviders } from "@/test/render";

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ lastUpdated: null, categories: [] }),
  }),
);

function renderAt(path: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/guide/:id" element={<GuidePage />} />
      <Route path="*" element={<p>landing</p>} />
    </Routes>,
    { initialEntries: [path] },
  );
}

describe("GuidePage", () => {
  it("renders the guide title, sections, and disclaimer", () => {
    renderAt("/guide/what-is-schizophrenia");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /what is schizophrenia, actually\?/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 2, name: /the short version/i }),
    ).toBeVisible();
    expect(screen.getByText(/not medical advice/i)).toBeVisible();
    expect(screen.getByText(/6 min read/i)).toBeVisible();
  });

  it("links to the next guide in reading order", () => {
    renderAt("/guide/what-is-schizophrenia");

    expect(
      screen.getByRole("link", { name: /warning signs/i }),
    ).toHaveAttribute("href", "/guide/early-warning-signs");
  });

  it("links to both neighbors from a middle guide", () => {
    renderAt("/guide/getting-help");

    const guideNav = within(
      screen.getByRole("navigation", { name: /guide navigation/i }),
    );
    expect(
      guideNav.getByRole("link", { name: /warning signs/i }),
    ).toHaveAttribute("href", "/guide/early-warning-signs");
    expect(guideNav.getByRole("link", { name: /treatment/i })).toHaveAttribute(
      "href",
      "/guide/treatment-explained",
    );
  });

  it("redirects to the landing page for an unknown guide id", () => {
    renderAt("/guide/not-a-guide");
    expect(screen.getByText("landing")).toBeInTheDocument();
  });

  it("renders crisis callouts where the guide defines them", () => {
    renderAt("/guide/early-warning-signs");
    expect(screen.getByText(/call or text 988/i)).toBeVisible();
  });
});
