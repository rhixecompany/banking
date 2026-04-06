import type { TotalBalanceBoxProps } from "@/types";

import AnimatedCounter from "@/components/animated-counter/animated-counter";
import DoughnutChart from "@/components/doughnut-chart/doughnut-chart";
import { Card, CardContent } from "@/components/ui/card";

/**
 * TotalBalanceBox displays aggregated balance information across all linked wallet accounts.
 * Shows a doughnut chart visualization and total balance with animated counter.
 *
 * @description
 * Renders the main balance summary card shown at the top of the dashboard.
 * Displays a doughnut chart showing balance distribution, the count of linked
 * wallets, and the total balance with an animated counter effect.
 *
 * @example
 * ```tsx
 * <TotalBalanceBox
 *   accounts={accounts}
 *   totalWallets={3}
 *   totalCurrentBalance={15000.00}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.accounts - Array of wallet accounts for chart visualization
 * @param props.totalWallets - Number of linked wallet accounts
 * @param props.totalCurrentBalance - Sum of all account balances in USD
 * @returns Rendered total balance box with chart and animated amount
 */
const TotalBalanceBox = ({
  accounts = [],
  totalCurrentBalance,
  totalWallets,
}: TotalBalanceBoxProps): JSX.Element => {
  return (
    <Card className="total-balance">
      <CardContent className="flex flex-row items-center gap-6 p-6">
        <div className="total-balance-chart">
          <DoughnutChart accounts={accounts} />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="header-2">Wallet Accounts: {totalWallets}</h2>
          <div className="flex flex-col gap-2">
            <p className="total-balance-label">Total Current Balance</p>
            <div className="flex-center total-balance-amount gap-2">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalBalanceBox;
