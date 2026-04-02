"use client";

import type { ReactNode } from "react";

import StatisticsCard01 from "@/components/shadcn-studio/blocks/statistics-card-01";

/**
 * Props for StatisticsCard01ClientWrapper.
 *
 * @interface StatisticsCard01ClientWrapperProps
 */
interface StatisticsCard01ClientWrapperProps {
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
 * Client wrapper for the Statistics Card 01 shadcn-studio block.
 *
 * @export
 * @param {StatisticsCard01ClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function StatisticsCard01ClientWrapper(
  props: StatisticsCard01ClientWrapperProps,
): JSX.Element {
  return <StatisticsCard01 {...props} />;
}
