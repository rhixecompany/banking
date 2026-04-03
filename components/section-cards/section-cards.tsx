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
 * Props for the SectionCards dashboard summary component.
 */
export interface SectionCardsProps {
  /** Total current balance across all linked accounts (USD). */
  totalBalance: number;
  /** Number of linked bank accounts. */
  linkedBanks: number;
  /** Total debit spend in the last 30 days (USD). */
  monthlySpend: number;
  /** Net change (credits − debits) in the last 30 days (USD). */
  netChange: number;
  /** Net change as a percentage of total debits (last 30 days). */
  netChangePct: number;
}

const usd = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: "currency",
});

const pct = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

/**
 * Renders four KPI summary cards for the dashboard:
 * Total Balance, Linked Banks, Monthly Spend, and Net Change.
 *
 * @param {SectionCardsProps} props
 * @returns {JSX.Element}
 */
export function SectionCards({
  linkedBanks,
  monthlySpend,
  netChange,
  netChangePct,
  totalBalance,
}: SectionCardsProps): JSX.Element {
  const isPositive = netChange >= 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Total Balance */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usd.format(totalBalance)}
          </CardTitle>
          <div className="absolute end-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              All accounts
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across all linked banks <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Combined current balance</div>
        </CardFooter>
      </Card>

      {/* Linked Banks */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Linked Banks</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {linkedBanks}
          </CardTitle>
          <div className="absolute end-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Financial institutions linked
          </div>
          <div className="text-muted-foreground">
            Via Plaid secure connection
          </div>
        </CardFooter>
      </Card>

      {/* Monthly Spend */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Monthly Spend</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usd.format(monthlySpend)}
          </CardTitle>
          <div className="absolute end-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              Last 30 days
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total debits this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Outgoing transactions only
          </div>
        </CardFooter>
      </Card>

      {/* Net Change */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Net Change</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usd.format(netChange)}
          </CardTitle>
          <div className="absolute end-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendIcon className="size-3" />
              {pct(netChangePct)}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isPositive ? "Net positive" : "Net negative"} this period{" "}
            <TrendIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Credits minus debits (30 days)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
