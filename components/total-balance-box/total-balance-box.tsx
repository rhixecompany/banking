import type { TotalBalanceBoxProps } from "@/types";

import AnimatedCounter from "@/components/animated-counter/animated-counter";
import DoughnutChart from "@/components/doughnut-chart/doughnut-chart";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {TotalBalanceBoxProps} param0
 * @param {TotalBalanceBoxProps} [param0.accounts=[]]
 * @param {TotalBalanceBoxProps} param0.totalBanks
 * @param {TotalBalanceBoxProps} param0.totalCurrentBalance
 * @returns {JSX.Element}
 */
const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps): JSX.Element => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="flex-center total-balance-amount gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
