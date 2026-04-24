import type { JSX } from "react";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Props for the StatCard component - a reusable KPI/statistics card.
 */
export interface StatCardProps {
  /** The main value to display (can be string or number) */
  value: string | number;
  /** Label/description above the value */
  label: string;
  /** Optional description in footer */
  footer?: string;
  /** Trend indicator: 'up' | 'down' | 'neutral' */
  trend?: "up" | "down" | "neutral";
  /** Optional trend value or suffix (e.g., "+12.5%", "# accounts") */
  trendSuffix?: string;
  /** Optional icon for the badge (defaults to TrendingUp/TrendingDown based on trend) */
  BadgeIcon?: typeof TrendingUpIcon;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format a number as USD currency.
 * Follows Law 4: Fail Loud - throws on invalid input.
 */
const formatCurrency = (value: number | string): string => {
  if (typeof value === "number") {
    const formatted = new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
    }).format(value);
    return formatted;
  }
  // If already a string, assume it's pre-formatted
  return String(value);
};

/**
 * Format a number as a percentage with sign.
 */
const formatPercent = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * StatCard - A reusable statistics card component.
 *
 * Displays a label, value, optional trend badge, and footer description.
 * Used in dashboards for KPI metrics (balances, counts, percentages).
 *
 * @example
 * ```tsx
 * <StatCard
 *   label="Total Balance"
 *   value={15000.00}
 *   trend="up"
 *   trendSuffix="All accounts"
 *   footer="Across all linked banks"
 * />
 * ```
 *
 * @param props - Component props
 * @returns Rendered stat card
 */
export function StatCard({
  value,
  label,
  footer,
  trend = "neutral",
  trendSuffix,
  BadgeIcon,
  className,
}: StatCardProps): JSX.Element {
  // Guard: value is required per Law 2 (Make Illegal States Unrepresentable)
  if (value === undefined || value === null) {
    throw new Error("StatCard requires a value prop");
  }

  // Determine icon based on trend (Law 5: Intentional Naming)
  const TrendIcon =
    BadgeIcon ??
    (trend === "up"
      ? TrendingUpIcon
      : trend === "down"
        ? TrendingDownIcon
        : TrendingUpIcon);

  // Format value - handle both numbers and pre-formatted strings
  const displayValue =
    typeof value === "number" ? formatCurrency(value) : String(value);

  // Format trend display
  const trendDisplay =
    typeof value === "number" && trend !== "neutral"
      ? formatPercent(value as number)
      : trendSuffix;

  return (
    <Card className={className}>
      <CardHeader className="relative">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {displayValue}
        </CardTitle>
        {trendDisplay && (
          <div className="absolute end-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendIcon className="size-3" />
              {trendDisplay}
            </Badge>
          </div>
        )}
      </CardHeader>
      {footer && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trend === "up"
              ? "Positive trend"
              : trend === "down"
                ? "Negative trend"
                : "Neutral"}{" "}
            <TrendIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );
}

export default StatCard;
