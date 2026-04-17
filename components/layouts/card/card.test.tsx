import { render, screen } from "@testing-library/react";

import Card from "./index";

describe("Card", () => {
  it("renders title and children", () => {
    render(
      <Card title="Test Title">
        <div>Child</div>
      </Card>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
