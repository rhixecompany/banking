import { render, screen } from "@testing-library/react";

import Row from "./index";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ id: string; name: string; }}
 */
const row = { id: "1", name: "Alice" };

describe("Row", () => {
  it("renders specified fields", () => {
    render(<Row row={row} fields={["id", "name"]} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });
});
