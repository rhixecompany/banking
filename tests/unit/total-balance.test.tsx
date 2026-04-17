import TotalBalanceLayout from "@/components/layouts/total-balance";
import { render, screen } from "@testing-library/react";

describe("TotalBalanceLayout", () => {
  it("renders total balances and wallets count", () => {
    render(
      <TotalBalanceLayout
        accounts={[
          {
            id: "a1",
            name: "Checking",
            availableBalance: 1000,
            currentBalance: 1200,
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
