import { render, screen } from "@testing-library/react";
import TotalBalanceLayout from "./index";

describe("TotalBalanceLayout", () => {
  it("renders total wallets and animated amount placeholder", () => {
    render(
      <TotalBalanceLayout
        accounts={[]}
        totalWallets={2}
        totalCurrentBalance={12345}
      />,
    );

    expect(screen.getByText(/Wallet Accounts: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Current Balance/i)).toBeInTheDocument();
  });
});
