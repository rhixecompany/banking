import type { TotlaBalanceBoxProps } from "@/types";

import AnimatedCounter from "@/components/AnimatedCounter";
import DoughnutChart from "@/components/DoughnutChart";
/**
 * Description placeholder
 *
 * @param {TotlaBalanceBoxProps} param0
 * @param {TotlaBalanceBoxProps} [param0.accounts=[]]
 * @param {TotlaBalanceBoxProps} param0.totalBanks
 * @param {TotlaBalanceBoxProps} param0.totalCurrentBalance
 * @returns {*}
 */
const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotlaBalanceBoxProps): JSX.Element => {
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
