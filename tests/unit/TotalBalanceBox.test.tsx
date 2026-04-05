import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Account } from "@/types";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// AnimatedCounter uses countup which needs a DOM — stub it to just show amount
vi.mock("@/components/animated-counter/animated-counter", () => ({
  default: ({ amount }: { amount: number }) => <span>{amount}</span>,
}));

// DoughnutChart uses canvas which happy-dom doesn't fully support
vi.mock("@/components/doughnut-chart/doughnut-chart", () => ({
  default: ({ accounts }: { accounts: Account[] }) => (
    <div data-testid="doughnut-chart">{accounts.length} accounts</div>
  ),
}));

import TotalBalanceBox from "@/components/total-balance-box/total-balance-box";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Account[]}
 */
const mockAccounts: Account[] = [
  {
    availableBalance: 1000,
    currentBalance: 1200,
    id: "acc-1",
    institutionId: "ins-1",
    mask: "1234",
    name: "Checking",
    officialName: "Primary Checking",
    subtype: "checking",
    type: "depository",
  },
  {
    availableBalance: 5000,
    currentBalance: 5200,
    id: "acc-2",
    institutionId: "ins-2",
    mask: "5678",
    name: "Savings",
    officialName: "High-Yield Savings",
    subtype: "savings",
    type: "depository",
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TotalBalanceBox", () => {
  it("renders the bank accounts count", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={2}
        totalCurrentBalance={6400}
      />,
    );
    expect(screen.getByText(/bank accounts:\s*2/i)).toBeTruthy();
  });

  it("renders the total current balance label", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={2}
        totalCurrentBalance={6400}
      />,
    );
    expect(screen.getByText("Total Current Balance")).toBeTruthy();
  });

  it("passes the correct amount to AnimatedCounter", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={2}
        totalCurrentBalance={6400}
      />,
    );
    // AnimatedCounter stub renders the raw number
    expect(screen.getByText("6400")).toBeTruthy();
  });

  it("renders the DoughnutChart with the accounts", () => {
    render(
      <TotalBalanceBox
        accounts={mockAccounts}
        totalBanks={2}
        totalCurrentBalance={6400}
      />,
    );
    expect(screen.getByTestId("doughnut-chart")).toBeTruthy();
    expect(screen.getByText("2 accounts")).toBeTruthy();
  });

  it("defaults accounts to empty array when not provided", () => {
    render(<TotalBalanceBox totalBanks={0} totalCurrentBalance={0} />);
    expect(screen.getByText(/bank accounts:\s*0/i)).toBeTruthy();
    expect(screen.getByText("0 accounts")).toBeTruthy();
  });
});
