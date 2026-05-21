import type { ColumnDef } from "@tanstack/react-table";

import { render, screen } from "@testing-library/react";

import { DataTable } from "../../components/layouts/data-table/index";

/**
 * Test data type
 */
interface TestUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Sample column definitions
 */
const columns: ColumnDef<TestUser>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

/**
 * Sample data
 */
const testData: TestUser[] = [
  { email: "alice@example.com", id: "1", name: "Alice" },
  { email: "bob@example.com", id: "2", name: "Bob" },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} data={testData} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<DataTable columns={columns} data={testData} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    render(
      <DataTable columns={columns} data={[]} emptyMessage="No users found" />,
    );

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("renders custom search input when searchColumn provided", () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        searchPlaceholder="Search users..."
        searchColumn="name"
      />,
    );

    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("displays pagination when enabled", () => {
    render(
      <DataTable
        columns={columns}
        data={testData}
        enablePagination={true}
        pageSize={10}
      />,
    );

    // Check pagination elements exist
    expect(screen.getByText(/of 2 row\(s\) shown/i)).toBeInTheDocument();
  });
});

describe("DataTable column types", () => {
  interface Transaction {
    id: string;
    amount: number;
    status: "completed" | "failed" | "pending";
    date: string;
  }

  const transactionColumns: ColumnDef<Transaction>[] = [
    { accessorKey: "id", header: "Transaction ID" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "date", header: "Date" },
  ];

  const transactionData: Transaction[] = [
    { amount: 100, date: "2024-01-15", id: "tx-001", status: "completed" },
    { amount: 250, date: "2024-01-16", id: "tx-002", status: "pending" },
    { amount: 50, date: "2024-01-17", id: "tx-003", status: "failed" },
  ];

  it("renders transaction columns correctly", () => {
    render(<DataTable columns={transactionColumns} data={transactionData} />);

    expect(screen.getByText("Transaction ID")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("renders all transaction rows", () => {
    render(<DataTable columns={transactionColumns} data={transactionData} />);

    expect(screen.getByText("tx-001")).toBeInTheDocument();
    expect(screen.getByText("tx-002")).toBeInTheDocument();
    expect(screen.getByText("tx-003")).toBeInTheDocument();
  });

  it("displays row count correctly for filtered results", () => {
    render(
      <DataTable
        columns={transactionColumns}
        data={transactionData}
        searchColumn="status"
      />,
    );

    expect(screen.getByText(/of 3 row\(s\) shown/i)).toBeInTheDocument();
  });
});
