import TransferSummary from "@/components/layouts/transfer-summary";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("renders transfer summary with placeholders when empty", () => {
  render(<TransferSummary />);
  expect(screen.getByText(/From/i)).toBeDefined();
  expect(screen.getByText(/To/i)).toBeDefined();
  expect(screen.getByText(/Amount/i)).toBeDefined();
  expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
});

test("renders actual values", () => {
  const wallet = { id: "w1", institutionName: "Bank A" };
  const recipient = { id: "r1", name: "Bob", email: "bob@example.com" };
  render(
    <TransferSummary
      sourceWallet={wallet}
      recipient={recipient}
      amount={12.5}
    />,
  );
  expect(screen.getByText("Bank A")).toBeDefined();
  expect(screen.getByText("Bob")).toBeDefined();
  expect(screen.getByText("$12.50")).toBeDefined();
});
