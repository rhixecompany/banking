"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { JSX } from "react";
import { Doughnut } from "react-chartjs-2";

import type { DoughnutChartProps } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Renders a doughnut chart visualising current balances across linked accounts.
 *
 * @param {DoughnutChartProps} props
 * @returns {JSX.Element}
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
