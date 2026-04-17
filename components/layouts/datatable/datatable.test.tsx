import { render, screen } from "@testing-library/react";

import Datatable from "./index";

const columns = [
  { header: "ID", key: "id" },
  { header: "Name", key: "name" },
];

const rows = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

describe("Datatable", () => {
  it("renders headers and rows", () => {
    render(<Datatable columns={columns} rows={rows} rowKey="id" />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
