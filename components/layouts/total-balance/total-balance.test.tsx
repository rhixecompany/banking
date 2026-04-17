import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock child components that require DOM/canvas
vi.mock("@/components/animated-counter/animated-counter", () => ({
  default: ({ amount }: { amount: number }) => <span>{amount}</span>,
}));

vi.mock("@/components/doughnut-chart/doughnut-chart", () => ({
  default: ({ accounts }: { accounts: unknown[] }) => (
    <div data-testid="doughnut-chart">{(accounts || []).length} accounts</div>
  ),
}));

import TotalBalanceLayout from "./index";

describe("TotalBalanceLayout (presentational)", () => {
  it("renders provided wallet counts and total balance", () => {
    render(
      <TotalBalanceLayout
        accounts={[{ id: "a1", currentBalance: 100 }] as any}
        totalWallets={1}
        totalCurrentBalance={100}
      />,
    );

    expect(screen.getByText(/Wallet Accounts: 1/i)).toBeTruthy();
    expect(screen.getByText("100 accounts")).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();
  });
});
