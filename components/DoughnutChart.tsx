"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { JSX } from "react";
import { Doughnut } from "react-chartjs-2";

import { DoughnutChartProps } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Description placeholder
 *
 * @param {DoughnutChartProps} _props
 * @returns {*}
 */

const DoughnutChart = (_props: DoughnutChartProps): JSX.Element => {
  void _props;
  const data = {
    datasets: [
      {
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
        data: [1250, 2500, 3750],
        label: "Banks",
      },
    ],
    labels: ["Bank 1", "Bank 2", "Bank 3"],
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
