import type { ReactNode } from "react";

import TotalBalanceBox from "@/components/total-balance-box/total-balance-box";

type TotalBalanceLayoutProps = {
  accounts?: any[];
  totalWallets?: number;
  totalCurrentBalance?: number;
  className?: string;
  children?: ReactNode;
};

/**
 * Thin layout wrapper for the total balance presentational component.
 * Keeps the presentational component under components/layouts for reuse.
 */
export default function TotalBalanceLayout({
  accounts = [],
  totalWallets = 0,
  totalCurrentBalance = 0,
  className,
}: TotalBalanceLayoutProps): JSX.Element {
  return (
    <div className={className}>
      <TotalBalanceBox
        accounts={accounts}
        totalWallets={totalWallets}
        totalCurrentBalance={totalCurrentBalance}
      />
    </div>
  );
}
