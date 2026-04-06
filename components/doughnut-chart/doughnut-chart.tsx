"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { JSX } from "react";
import { Doughnut } from "react-chartjs-2";

import type { DoughnutChartProps } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * DoughnutChart visualizes the distribution of account balances across linked wallet accounts.
 * Uses Chart.js with react-chartjs-2 for rendering.
 *
 * @description
 * Renders an interactive doughnut chart showing balance distribution.
 * Each segment represents a different linked wallet account with its current balance.
 * The chart uses a 60% cutout for the classic doughnut appearance.
 *
 * @example
 * ```tsx
 * <DoughnutChart accounts={[
 *   { name: "Checking", currentBalance: 1500 },
 *   { name: "Savings", currentBalance: 5000 }
 * ]} />
 * ```
 *
 * @param props - Component props
 * @param props.accounts - Array of wallet accounts with balances to visualize
 * @returns Rendered doughnut chart with balance distribution
 */
const DoughnutChart = ({ accounts }: DoughnutChartProps): JSX.Element => {
  const data = {
    datasets: [
      {
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
        data: accounts.map((a) => a.currentBalance ?? 0),
        label: "Balance",
      },
    ],
    labels: accounts.map((a) => a.officialName ?? a.name),
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
