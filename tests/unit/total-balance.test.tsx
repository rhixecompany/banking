import { render, screen } from "@testing-library/react";

import TotalBalanceLayout from "@/components/layouts/total-balance";

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
