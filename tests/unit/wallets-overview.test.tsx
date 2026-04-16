import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/// <reference types="vitest" />
import WalletsOverview from "@/components/shared/wallets-overview";

describe("WalletsOverview", () => {
  it("renders a list of wallets and total balance", () => {
    const wallets = [
      {
        accountSubtype: "Standard",
        accountType: "Checking",
        balances: [
          {
            accountId: "acc1",
            balances: { available: 1234, current: 1234, limit: null },
          },
        ],
        id: "w1",
        institutionName: "Mock Bank",
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
