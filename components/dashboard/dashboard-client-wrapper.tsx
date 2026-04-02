"use client";

import { BanknoteIcon, CalendarIcon, LayoutListIcon } from "lucide-react";
import Link from "next/link";

import type { Bank } from "@/types/bank";

import HeaderBox from "@/components/HeaderBox";
import { PlaidProvider } from "@/components/plaid-context";
import { PlaidLinkButton } from "@/components/plaid-link-button";
import SalesMetricsCard from "@/components/shadcn-studio/blocks/chart-sales-metrics";
import StatisticsCard from "@/components/shadcn-studio/blocks/statistics-card-01";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardClientWrapperProps {
  banks: Bank[];
  userId: string;
  userName: string;
}

/**
 * Client wrapper for the dashboard page.
 * Wraps content in PlaidProvider for bank-linking functionality.
 * Renders the greeting header, statistics cards, sales metrics, and linked banks overview.
 *
 * @export
 * @param {DashboardClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function DashboardClientWrapper({
  banks,
  userId,
  userName,
}: DashboardClientWrapperProps): JSX.Element {
  const linkedBanksCount = banks.length.toString();
  const accountType = banks[0]?.accountType ?? "N/A";
  const lastUpdated = banks[0]?.updatedAt
    ? new Date(banks[0].updatedAt).toLocaleDateString()
    : "N/A";

  return (
    <PlaidProvider userId={userId}>
      <section className="space-y-8">
        <header>
          <HeaderBox
            type="greeting"
            title="Welcome back,"
            user={userName}
            subtext="Here's your financial overview"
          />
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <StatisticsCard
            icon={<BanknoteIcon className="size-4" />}
            value={linkedBanksCount}
            title="Linked Banks"
            changePercentage="Total connected accounts"
          />
          <StatisticsCard
            icon={<LayoutListIcon className="size-4" />}
            value={accountType}
            title="Account Type"
            changePercentage={
              banks.length > 0 ? "Primary account" : "No accounts linked"
            }
          />
          <StatisticsCard
            icon={<CalendarIcon className="size-4" />}
            value={lastUpdated}
            title="Last Updated"
            changePercentage="Most recent activity"
          />
        </div>

        <SalesMetricsCard />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common banking operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <PlaidLinkButton variant="default" />
              <Link
                href="/payment-transfer"
                className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Transfer Money
              </Link>
              <Link
                href="/transaction-history"
                className="block w-full rounded-md border border-input bg-background px-4 py-2 text-center text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                View Transactions
              </Link>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Linked Banks</CardTitle>
              <CardDescription>
                Your connected financial institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {banks.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="mb-4 text-muted-foreground">
                    No banks linked yet
                  </p>
                  <PlaidLinkButton variant="outline">
                    Link Your First Bank
                  </PlaidLinkButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {banks.slice(0, 3).map((bank) => (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {bank.institutionName ?? "Unknown Bank"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bank.accountType ?? "Account"} -{" "}
                          {bank.accountSubtype ?? "Standard"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Link
                          href="/my-banks"
                          className="text-sm text-primary hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  ))}
                  {banks.length > 3 && (
                    <Link
                      href="/my-banks"
                      className="block text-center text-sm text-primary hover:underline"
                    >
                      View all {banks.length} banks
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PlaidProvider>
  );
}
