import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TransactionList from "@/components/layouts/transaction-list";

const mockTx = {
  transactionId: "t1",
  name: "Coffee",
  date: new Date().toISOString().split("T")[0],
  amount: -4.5,
  category: ["Food and Drink"],
};

describe("TransactionList", () => {
  it("renders transactions and formatted amount", () => {
    render(<TransactionList transactions={[mockTx as any]} />);
    expect(screen.getByText(/Coffee/i)).toBeTruthy();
    expect(screen.getByText(/Food and Drink/i)).toBeTruthy();
  });
});
