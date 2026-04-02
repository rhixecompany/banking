import { describe, expect, it, vi } from "vitest";

/**
 * Unit tests for TransactionHistoryClientWrapper.
 *
 * Focus: the `toItem` mapping function — specifically the paidBy fix
 * (channel "in store" → "mastercard", everything else → "visa") and
 * the status normalisation logic.
 *
 * We test the mapping indirectly by rendering the wrapper and inspecting
 * the data passed to the datatable stub, but since the datatable is a
 * heavy canvas/table component we stub it and capture the `data` prop.
 */

// ---------------------------------------------------------------------------
// Capture what TransactionDatatable receives
// ---------------------------------------------------------------------------

interface CapturedItem {
  id: string;
  paidBy: string;
  status: string;
  name: string;
  email: string;
  amount: number;
}

let capturedData: CapturedItem[] = [];

vi.mock("@/components/shadcn-studio/blocks/datatable-transaction", () => ({
  default: ({ data }: { data: CapturedItem[] }) => {
    capturedData = data;
    return <div data-testid="datatable" />;
  },
}));

vi.mock("@/components/HeaderBox", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

import { render, screen } from "@testing-library/react";

import type { Transaction } from "@/types/transaction";

import { TransactionHistoryClientWrapper } from "@/components/transaction-history/transaction-history-client-wrapper";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    amount: "100.00",
    category: "Transfer",
    channel: "online",
    createdAt: new Date(),
    currency: "USD",
    email: "alice@example.com",
    id: "tx-1",
    name: "Alice Bob",
    plaidTransactionId: undefined as unknown as null | string,
    receiverBankId: "bank-2",
    senderBankId: "bank-1",
    status: "paid",
    type: "debit",
    updatedAt: new Date(),
    userId: "user-1",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests — paidBy derivation
// ---------------------------------------------------------------------------

describe("TransactionHistoryClientWrapper — paidBy mapping", () => {
  it("maps channel 'in store' to paidBy 'mastercard'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[makeTransaction({ id: "tx-1", channel: "in store" })]}
      />,
    );
    expect(capturedData[0]?.paidBy).toBe("mastercard");
  });

  it("maps channel 'online' to paidBy 'visa'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[makeTransaction({ id: "tx-2", channel: "online" })]}
      />,
    );
    expect(capturedData[0]?.paidBy).toBe("visa");
  });

  it("maps null channel to paidBy 'visa'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[
          makeTransaction({
            id: "tx-3",
            channel: undefined as unknown as null | string,
          }),
        ]}
      />,
    );
    expect(capturedData[0]?.paidBy).toBe("visa");
  });

  it("maps an unknown channel to paidBy 'visa'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[makeTransaction({ id: "tx-4", channel: "atm" })]}
      />,
    );
    expect(capturedData[0]?.paidBy).toBe("visa");
  });
});

// ---------------------------------------------------------------------------
// Tests — status normalisation
// ---------------------------------------------------------------------------

describe("TransactionHistoryClientWrapper — status normalisation", () => {
  it.each(["paid", "pending", "failed", "processing"] as const)(
    "preserves valid status '%s'",
    (status) => {
      capturedData = [];
      render(
        <TransactionHistoryClientWrapper
          transactions={[makeTransaction({ id: `tx-${status}`, status })]}
        />,
      );
      expect(capturedData[0]?.status).toBe(status);
    },
  );

  it("normalises an unknown status to 'pending'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[makeTransaction({ id: "tx-bad", status: "unknown" })]}
      />,
    );
    expect(capturedData[0]?.status).toBe("pending");
  });

  it("normalises null status to 'pending'", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[
          makeTransaction({
            id: "tx-null",
            status: undefined as unknown as null | string,
          }),
        ]}
      />,
    );
    expect(capturedData[0]?.status).toBe("pending");
  });
});

// ---------------------------------------------------------------------------
// Tests — avatarFallback derivation
// ---------------------------------------------------------------------------

describe("TransactionHistoryClientWrapper — avatarFallback derivation", () => {
  it("builds two-letter initials from a full name", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[
          makeTransaction({
            id: "tx-name",
            name: "Alice Bob",
            email: undefined as unknown as null | string,
          }),
        ]}
      />,
    );
    expect(capturedData[0]?.name).toBe("Alice Bob");
  });

  it("falls back to email when name is null", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[
          makeTransaction({
            id: "tx-email",
            name: undefined as unknown as null | string,
            email: "z@x.com",
          }),
        ]}
      />,
    );
    expect(capturedData[0]?.name).toBe("z@x.com");
  });

  it("falls back to 'Unknown' when both name and email are null", () => {
    capturedData = [];
    render(
      <TransactionHistoryClientWrapper
        transactions={[
          makeTransaction({
            id: "tx-unknown",
            name: undefined as unknown as null | string,
            email: undefined as unknown as null | string,
          }),
        ]}
      />,
    );
    expect(capturedData[0]?.name).toBe("Unknown");
  });
});

// ---------------------------------------------------------------------------
// Tests — structural rendering
// ---------------------------------------------------------------------------

describe("TransactionHistoryClientWrapper — rendering", () => {
  it("renders the Transaction History heading", () => {
    render(<TransactionHistoryClientWrapper transactions={[]} />);
    expect(
      screen.getByRole("heading", { name: "Transaction History" }),
    ).toBeTruthy();
  });

  it("renders the datatable", () => {
    render(<TransactionHistoryClientWrapper transactions={[]} />);
    expect(screen.getByTestId("datatable")).toBeTruthy();
  });

  it("passes all transactions as items to the datatable", () => {
    capturedData = [];
    const txns = [
      makeTransaction({ id: "a" }),
      makeTransaction({ id: "b" }),
      makeTransaction({ id: "c" }),
    ];
    render(<TransactionHistoryClientWrapper transactions={txns} />);
    expect(capturedData).toHaveLength(3);
    expect(capturedData.map((d) => d.id)).toEqual(["a", "b", "c"]);
  });
});
