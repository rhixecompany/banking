/// <reference types="vitest" />
import WalletsOverview from "@/components/shared/wallets-overview";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("WalletsOverview", () => {
  it("renders a list of wallets and total balance", () => {
    const wallets = [
      {
        id: "w1",
        institutionName: "Mock Bank",
        accountType: "Checking",
        accountSubtype: "Standard",
        balances: [
          {
            balances: { current: 1234, available: 1234, limit: null },
            accountId: "acc1",
          },
        ],
        transactions: [],
      },
    ];

    render(
      <WalletsOverview
        walletsWithDetails={wallets as any}
        totalBalance={1234}
        showActions={false}
      />,
    );

    expect(screen.getByText("Mock Bank")).toBeTruthy();
    expect(screen.getByText("Total Balance:", { exact: false })).toBeTruthy();
    // formatted amount
    expect(screen.getByText("$1,234.00")).toBeTruthy();
  });
});
