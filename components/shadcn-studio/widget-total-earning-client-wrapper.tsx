"use client";

import WidgetTotalEarning from "@/components/shadcn-studio/blocks/widget-total-earning";

const earningData = [
  {
    earnings: "$4,200",
    img: "/icons/monitor.svg",
    platform: "Web",
    progressPercentage: 72,
    technologies: "React, Next.js",
  },
  {
    earnings: "$2,800",
    img: "/icons/smartphone.svg",
    platform: "Mobile",
    progressPercentage: 48,
    technologies: "React Native",
  },
  {
    earnings: "$1,100",
    img: "/icons/cloud.svg",
    platform: "API",
    progressPercentage: 31,
    technologies: "Node.js, REST",
  },
];

/**
 * Client wrapper for the Widget Total Earning shadcn-studio block.
 *
 * @export
 * @returns {JSX.Element}
 */
export function WidgetTotalEarningClientWrapper(): JSX.Element {
  return (
    <WidgetTotalEarning
      comparisonText="vs last month"
      earning={8100}
      earningData={earningData}
      percentage={12}
      title="Total Earning"
      trend="up"
    />
  );
}
