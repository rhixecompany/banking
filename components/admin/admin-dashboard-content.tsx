"use client";

import type { AdminStats, AdminTransaction } from "@/lib/validations/admin";

import SalesMetricsCard from "@/components/shadcn-studio/blocks/chart-sales-metrics";
import TransactionDatatable, {
  type Item,
} from "@/components/shadcn-studio/blocks/datatable-transaction";
import StatisticsCard from "@/components/shadcn-studio/blocks/statistics-card-01";
import ProductInsightsCard from "@/components/shadcn-studio/blocks/widget-product-insights";
import TotalEarningCard from "@/components/shadcn-studio/blocks/widget-total-earning";
import { Card } from "@/components/ui/card";
import { FilterStoreProvider } from "@/stores/filter-store";

import { earningData, statisticsCardData, transactionData } from "./admin-data";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @returns {React.JSX.Element}
 */
interface AdminDashboardContentProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(AdminTransaction[] | undefined)}
   */
  recentTransactions: AdminTransaction[] | undefined;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(AdminStats | null | undefined)}
   */
  stats: AdminStats | null | undefined;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(Record<string, number> | undefined)}
   */
  transactionStatusStats: Record<string, number> | undefined;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(Record<string, number> | undefined)}
   */
  transactionTypeStats: Record<string, number> | undefined;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {AdminDashboardContentProps} param0
 * @param {{}} param0.recentTransactions
 * @param {*} param0.stats
 * @param {*} param0.transactionStatusStats
 * @param {*} param0.transactionTypeStats
 * @returns {React.JSX.Element}
 */
const AdminDashboardContent = ({
  recentTransactions,
  stats,
  transactionStatusStats,
  transactionTypeStats,
}: AdminDashboardContentProps): React.JSX.Element => {
  const useLiveData =
    Boolean(stats) ||
    (recentTransactions?.length ?? 0) > 0 ||
    Object.keys(transactionStatusStats ?? {}).length > 0 ||
    Object.keys(transactionTypeStats ?? {}).length > 0;

  const fallbackAvatar =
    transactionData[0]?.avatar ??
    "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png";
  const avatarPool = transactionData.map((item) => item.avatar);

  function getAvatar(index: number): string {
    if (avatarPool.length === 0) return fallbackAvatar;
    return avatarPool[index % avatarPool.length] ?? fallbackAvatar;
  }

  function getInitials(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "NA";
    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  }

  function normalizeStatus(status?: string): Item["status"] {
    if (!status) return "pending";
    switch (status) {
      case "completed":
        return "paid";
      case "processing":
        return "processing";
      case "failed":
      case "cancelled":
        return "failed";
      case "pending":
      default:
        return "pending";
    }
  }

  const statisticsCards = stats
    ? [
        {
          ...statisticsCardData[0],
          title: "Total Users",
          value: stats.totalUsers.toLocaleString(),
        },
        {
          ...statisticsCardData[1],
          title: "Total Wallets",
          value: stats.totalWallets.toLocaleString(),
        },
        {
          ...statisticsCardData[2],
          title: "Total Transactions",
          value: stats.totalTransactions.toLocaleString(),
        },
      ]
    : statisticsCardData;

  const resolvedTransactions: Item[] =
    recentTransactions && recentTransactions.length > 0
      ? recentTransactions.map((transaction, index) => {
          const name = transaction.user.name || "Unknown User";
          return {
            amount: transaction.amount,
            avatar: getAvatar(index),
            avatarFallback: getInitials(name),
            email: transaction.user.email || "unknown@example.com",
            id: transaction.id,
            name,
            paidBy: index % 2 === 0 ? "visa" : "mastercard",
            status: normalizeStatus(transaction.status),
          };
        })
      : transactionData;

  const totalEarning = stats?.totalAmount ?? 24650;

  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Statistics Cards */}
        <div className="col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1">
          {statisticsCards.map((card, index) => (
            <StatisticsCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              changePercentage={card.changePercentage}
            />
          ))}
        </div>

        <div className="grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2">
          {/* Product Insights Card */}
          <ProductInsightsCard className="justify-between gap-3 [&>[data-slot=card-content]]:space-y-5" />

          {/* Total Earning Card */}
          <TotalEarningCard
            title="Total Earning"
            earning={totalEarning}
            trend="up"
            percentage={10}
            comparisonText="Compare to last year ($84,325)"
            earningData={earningData}
            className="justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7"
          />
        </div>

        <SalesMetricsCard className="col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6" />

        <FilterStoreProvider>
          <Card className="col-span-full w-full py-0">
            <TransactionDatatable data={resolvedTransactions} />
          </Card>
        </FilterStoreProvider>
        <p className="col-span-full text-xs text-muted-foreground">
          {useLiveData
            ? "Live metrics based on current activity."
            : "Sample metrics shown until live data is available."}
        </p>
      </div>
    </main>
  );
};

export default AdminDashboardContent;
