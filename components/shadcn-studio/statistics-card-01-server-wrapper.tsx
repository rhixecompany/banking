import type { ReactNode } from "react";

import StatisticsCard01 from "@/components/shadcn-studio/blocks/statistics-card-01";

/**
 * Props for StatisticsCard01ServerWrapper.
 *
 * @interface StatisticsCard01ServerWrapperProps
 */
interface StatisticsCard01ServerWrapperProps {
  /** Icon to display in the card header. */
  icon: ReactNode;
  /** Primary value to display. */
  value: string;
  /** Card title. */
  title: string;
  /** Percentage change string (e.g. "+12%"). */
  changePercentage: string;
  /** Optional extra class names. */
  className?: string;
}

/**
 * Server wrapper for the Statistics Card 01 shadcn-studio block.
 *
 * @export
 * @param {StatisticsCard01ServerWrapperProps} props
 * @returns {JSX.Element}
 */
export function StatisticsCard01ServerWrapper(
  props: StatisticsCard01ServerWrapperProps,
): JSX.Element {
  return <StatisticsCard01 {...props} />;
}
