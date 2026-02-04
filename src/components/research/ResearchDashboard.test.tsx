import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import type { ResearchPayload } from "@/lib/types";
import { ResearchDashboard } from "./ResearchDashboard";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

const mockPayload: ResearchPayload = {
  lastUpdated: "2024-08-22T12:00:00.000Z",
  sources: [
    {
      name: "PubMed",
      url: "https://pubmed.ncbi.nlm.nih.gov",
      description: "NIH data",
    },
  ],
  categories: [
    {
      id: "diagnosis",
      title: "Diagnosis",
      summary: "summary",
      articles: [
        {
          id: "123",
          title: "Prodromal biomarkers update",
          journal: "JAMA Psychiatry",
          published: "2024",
          url: "https://example.com",
          authors: ["Smith"],
        },
      ],
    },
  ],
};

describe("ResearchDashboard", () => {
  it("renders hero metrics and article content", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(
      screen.getByRole("heading", { name: /Schizopedia/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Prodromal biomarkers update/i)).toBeVisible();
    expect(screen.getAllByText(/PubMed/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/JAMA Psychiatry/i)).toBeVisible();
  });

  it("shows skeleton state while loading", () => {
    renderWithTheme(<ResearchDashboard data={null} loading error={null} />);
    expect(screen.getAllByText(/Pending sync/i).length).toBeGreaterThan(0);
  });
});
