import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SourcesPanel } from "./SourcesPanel";
import type { ResearchSource } from "@/lib/types";

const sources: ResearchSource[] = [
  {
    name: "PubMed (NIH)",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    description: "Peer-reviewed medical literature",
  },
];

describe("SourcesPanel", () => {
  it("renders heading and description", () => {
    render(<SourcesPanel sources={sources} />);

    expect(
      screen.getByText("Where this research comes from"),
    ).toBeVisible();
    expect(
      screen.getByText(/National Institutes of Health/i),
    ).toBeVisible();
  });

  it("renders source name and description", () => {
    render(<SourcesPanel sources={sources} />);

    expect(screen.getByText("PubMed (NIH)")).toBeVisible();
    expect(
      screen.getByText("Peer-reviewed medical literature"),
    ).toBeVisible();
  });

  it("renders visit source link with correct href", () => {
    render(<SourcesPanel sources={sources} />);

    const link = screen.getByText("Visit source");
    expect(link).toHaveAttribute(
      "href",
      "https://pubmed.ncbi.nlm.nih.gov/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("renders multiple sources", () => {
    const multipleSources: ResearchSource[] = [
      ...sources,
      { name: "ClinicalTrials.gov", url: "https://clinicaltrials.gov/" },
    ];

    render(<SourcesPanel sources={multipleSources} />);

    expect(screen.getByText("PubMed (NIH)")).toBeVisible();
    expect(screen.getByText("ClinicalTrials.gov")).toBeVisible();
  });
});
