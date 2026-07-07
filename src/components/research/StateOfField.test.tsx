import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StateOfField } from "./StateOfField";
import type { ResearchArticle } from "@/lib/types";

const citation: ResearchArticle = {
  id: "1",
  title: "A landmark study",
  url: "https://pubmed.ncbi.nlm.nih.gov/1/",
  authors: ["Doe J"],
  journal: "Nature",
  published: "2026-06-12",
};

describe("StateOfField", () => {
  it("renders each summary paragraph", () => {
    render(
      <StateOfField
        paragraphs={["First paragraph.", "Second paragraph."]}
        citations={[]}
      />,
    );
    expect(screen.getByText("First paragraph.")).toBeVisible();
    expect(screen.getByText("Second paragraph.")).toBeVisible();
  });

  it("lists citations linking to their source", () => {
    render(<StateOfField paragraphs={["x"]} citations={[citation]} />);
    const link = screen.getByRole("link", { name: /a landmark study/i });
    expect(link).toHaveAttribute("href", citation.url);
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText(/documented by/i)).toBeVisible();
  });

  it("omits the citation list when there are none", () => {
    render(<StateOfField paragraphs={["x"]} citations={[]} />);
    expect(screen.queryByText(/documented by/i)).not.toBeInTheDocument();
  });
});
