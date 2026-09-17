import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowseTopics } from "./BrowseTopics";
import { renderWithRouter } from "@/test/render";

describe("BrowseTopics", () => {
  it("exposes an accessible Topics region", () => {
    renderWithRouter(<BrowseTopics />);

    expect(screen.getByRole("region", { name: "Topics" })).toBeVisible();
  });

  it.each([
    ["Cure research", "/category/cure"],
    ["Diagnosis", "/category/diagnosis"],
    ["Treatment", "/category/treatment"],
    ["Prevention and early support", "/category/prevention"],
  ])("links %s to %s", (label, href) => {
    renderWithRouter(<BrowseTopics />);
    const topics = screen.getByRole("region", { name: "Topics" });

    expect(within(topics).getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
    expect(within(topics).getAllByRole("link")).toHaveLength(4);
  });
});
