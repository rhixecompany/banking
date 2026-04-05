"use client";

import SalesMetricsCard from "@/components/shadcn-studio/blocks/chart-sales-metrics";
import TransactionDatatable from "@/components/shadcn-studio/blocks/datatable-transaction";
import StatisticsCard from "@/components/shadcn-studio/blocks/statistics-card-01";
import ProductInsightsCard from "@/components/shadcn-studio/blocks/widget-product-insights";
import TotalEarningCard from "@/components/shadcn-studio/blocks/widget-total-earning";
import { Card } from "@/components/ui/card";

import { earningData, statisticsCardData, transactionData } from "./admin-data";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @returns {React.JSX.Element}
 */
const AdminDashboardContent = (): React.JSX.Element => {
  return (
    <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {/* Statistics Cards */}
        <div className="col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1">
          {statisticsCardData.map((card, index) => (
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
            earning={24650}
            trend="up"
            percentage={10}
            comparisonText="Compare to last year ($84,325)"
            earningData={earningData}
            className="justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7"
          />
        </div>

        <SalesMetricsCard className="col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6" />

        <Card className="col-span-full w-full py-0">
          <TransactionDatatable data={transactionData} />
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboardContent;
