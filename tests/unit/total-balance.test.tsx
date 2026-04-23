import { render, screen } from "@testing-library/react";

import TotalBalanceLayout from "@/components/layouts/total-balance";
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

describe("TotalBalanceLayout (presentational)", () => {
  it("renders provided wallet counts and total balance", () => {
    render(
      <TotalBalanceLayout
        accounts={[{ currentBalance: 100, id: "a1" }] as any}
        totalWallets={1}
        totalCurrentBalance={100}
      />,
    );

    expect(screen.getByText(/Wallet Accounts: 1/i)).toBeTruthy();
    expect(screen.getByText("100 accounts")).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();
  });
});

describe("TotalBalanceLayout", () => {
  it("renders total balances and wallets count", () => {
    render(
      <TotalBalanceLayout
        accounts={[
          {
            availableBalance: 1000,
            currentBalance: 1200,
            id: "a1",
            name: "Checking",
          },
        ]}
        totalWallets={1}
        totalCurrentBalance={1200}
      />,
    );

    // The presentational TotalBalanceBox shows balances; assert some expected text
    expect(screen.getByText(/Checking/i)).toBeInTheDocument();
    const heading = screen.getByRole("heading", { name: /Wallet Accounts/i });
    expect(heading).toHaveTextContent("1");
    expect(screen.getByText(/1200/)).toBeInTheDocument();
  });
});
