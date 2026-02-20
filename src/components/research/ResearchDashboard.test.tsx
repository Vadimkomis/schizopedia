import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
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
      summary: "How schizophrenia is identified",
      articles: [
        {
          id: "123",
          title: "Prodromal biomarkers update",
          journal: "JAMA Psychiatry",
          published: "2024",
          url: "https://example.com/123",
          authors: ["Smith"],
          snippet: "A study on biomarkers",
        },
      ],
    },
    {
      id: "treatment",
      title: "Treatment",
      summary: "Current treatments",
      articles: [
        {
          id: "456",
          title: "Antipsychotic efficacy study",
          journal: "Lancet Psychiatry",
          published: "2024",
          url: "https://example.com/456",
          authors: ["Jones", "Lee"],
        },
      ],
    },
    {
      id: "prevention",
      title: "Prevention",
      summary: "Risk reduction research",
      articles: [],
    },
  ],
};

describe("ResearchDashboard", () => {
  it("renders hero heading and first tab content", () => {
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

  it("renders error banner when error is provided", () => {
    renderWithTheme(
      <ResearchDashboard
        data={null}
        loading={false}
        error="Network request failed"
      />,
    );
    expect(screen.getByText("Network request failed")).toBeVisible();
  });

  it("renders tab triggers for all 3 categories", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(screen.getByRole("tab", { name: "Diagnosis" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Treatment" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Prevention" })).toBeVisible();
  });

  it("shows first category by default, others hidden", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(screen.getByText("Prodromal biomarkers update")).toBeVisible();

    const diagnosisTab = screen.getByRole("tab", { name: "Diagnosis" });
    expect(diagnosisTab).toHaveAttribute("aria-selected", "true");

    const treatmentTab = screen.getByRole("tab", { name: "Treatment" });
    expect(treatmentTab).toHaveAttribute("aria-selected", "false");
  });

  it("switches tab content when clicking a different tab", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(screen.getByText("Prodromal biomarkers update")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Treatment" }));

    expect(screen.getByText("Antipsychotic efficacy study")).toBeVisible();
  });

  it("renders sources panel", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(
      screen.getByText(/Where this research comes from/i),
    ).toBeVisible();
  });

  it("uses fallback categories when data is null", () => {
    renderWithTheme(
      <ResearchDashboard data={null} loading={false} error={null} />,
    );

    expect(screen.getByRole("tab", { name: "Diagnosis" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Treatment" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Prevention" })).toBeVisible();
  });

  it("article links have correct target and rel attributes", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    const link = screen.getByText("Prodromal biomarkers update").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("renders theme toggle button", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("renders skip navigation link", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    const skipLink = screen.getByText("Skip to research categories");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#research-categories");
  });

  it("renders the research-categories section with correct id", () => {
    renderWithTheme(
      <ResearchDashboard data={mockPayload} loading={false} error={null} />,
    );

    const section = document.getElementById("research-categories");
    expect(section).toBeInTheDocument();
  });
});
