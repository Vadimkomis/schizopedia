import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Search } from "lucide-react";
import { CategoryIconCard } from "./CategoryIconCard";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("CategoryIconCard", () => {
  it("renders title, description, and link", () => {
    renderWithRouter(
      <CategoryIconCard
        title="Diagnosis"
        description="Learn about diagnosis tools"
        to="/category/diagnosis"
        icon={Search}
        tint="sky"
      />,
    );

    expect(screen.getByText("Diagnosis")).toBeVisible();
    expect(screen.getByText("Learn about diagnosis tools")).toBeVisible();
    const link = screen.getByRole("link", { name: /learn more/i });
    expect(link).toHaveAttribute("href", "/category/diagnosis");
  });

  it("applies the tint class on the icon container", () => {
    const { container } = renderWithRouter(
      <CategoryIconCard
        title="Prevention"
        description="Prevention description"
        to="/category/prevention"
        icon={Search}
        tint="mint"
      />,
    );

    expect(container.querySelector(".tint-mint")).toBeInTheDocument();
  });
});
