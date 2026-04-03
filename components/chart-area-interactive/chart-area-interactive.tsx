"use client";

import type { JSX } from "react";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Transaction } from "@/types/transaction";

/** Shape of a single aggregated day entry for the chart. */
interface DayEntry {
  date: string;
  credits: number;
  debits: number;
}

const chartConfig = {
  credits: {
    color: "#16a34a",
    label: "Credits",
  },
  debits: {
    color: "#dc2626",
    label: "Debits",
  },
} satisfies ChartConfig;

/** Props for ChartAreaInteractive. */
export interface ChartAreaInteractiveProps {
  /** All transactions to display — grouped by date into credits & debits. */
  transactions: Transaction[];
}

/**
 * ChartAreaInteractive renders a stacked area chart of transaction
 * credits and debits grouped by day, filterable by time range.
 */
export function ChartAreaInteractive({
  transactions,
}: ChartAreaInteractiveProps): JSX.Element {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Group transactions by date → { date, credits, debits }
  const chartData = React.useMemo<DayEntry[]>(() => {
    const map = new Map<string, DayEntry>();

    for (const tx of transactions) {
      const date = tx.createdAt.toISOString().slice(0, 10);

      const existing = map.get(date) ?? { date, credits: 0, debits: 0 };

      if (tx.type === "credit") {
        existing.credits += Number(tx.amount);
      } else if (tx.type === "debit") {
        existing.debits += Number(tx.amount);
      }

      map.set(date, existing);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [transactions]);

  const filteredData = React.useMemo<DayEntry[]>(() => {
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Transaction Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Credits &amp; debits over time
          </span>
          <span className="@[540px]/card:hidden">Credits &amp; debits</span>
        </CardDescription>
        <div className="absolute end-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCredits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-credits)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-credits)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDebits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-debits)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-debits)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value as string);
                return date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(
                      value as number | string,
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="debits"
              type="natural"
              fill="url(#fillDebits)"
              stroke="var(--color-debits)"
              stackId="a"
            />
            <Area
              dataKey="credits"
              type="natural"
              fill="url(#fillCredits)"
              stroke="var(--color-credits)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
