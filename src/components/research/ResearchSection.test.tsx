import { render, screen } from "@testing-library/react";
import { Sparkles } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ResearchSection } from "./ResearchSection";
import type { ResearchArticle } from "@/lib/types";

const article: ResearchArticle = {
  id: "1",
  title: "An important study",
  url: "https://pubmed.ncbi.nlm.nih.gov/1/",
};

describe("ResearchSection", () => {
  it("renders the title, description, and article cards", () => {
    render(
      <ResearchSection
        id="important"
        icon={Sparkles}
        title="Most important research"
        description="The landmark studies."
        articles={[article]}
        emptyLabel="nothing yet"
      />,
    );
    expect(
      screen.getByRole("heading", { name: /most important research/i }),
    ).toBeVisible();
    expect(screen.getByText("The landmark studies.")).toBeVisible();
    expect(screen.getByText("An important study")).toBeVisible();
    expect(screen.queryByText("nothing yet")).not.toBeInTheDocument();
  });

  it("shows the empty label when there are no articles", () => {
    render(
      <ResearchSection
        id="latest"
        icon={Sparkles}
        title="Latest research"
        description="Newest first."
        articles={[]}
        emptyLabel="No studies indexed yet."
      />,
    );
    expect(screen.getByText("No studies indexed yet.")).toBeVisible();
  });
});
