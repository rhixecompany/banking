"use client";

import type { JSX } from "react";

import type { Account } from "@/types";
import type { Transaction } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";

import { ChartAreaInteractive } from "@/components/chart-area-interactive/chart-area-interactive";
import DoughnutChart from "@/components/doughnut-chart/doughnut-chart";
import HeaderBox from "@/components/header-box/header-box";
import { SectionCards } from "@/components/section-cards/section-cards";
import OnboardingFeed from "@/components/shadcn-studio/blocks/onboarding-feed-01/onboarding-feed-01";
import WalletsOverview from "@/components/shared/wallets-overview";
import TotalBalanceBox from "@/components/total-balance-box/total-balance-box";

/** Route path to the My Wallets page. */
const MY_WALLETS_PATH = "/my-wallets" as const;

/** Props for DashboardClientWrapper. */
interface DashboardClientWrapperProps {
  /** Array of account objects from Plaid with balance and type information. */
  accounts: Account[];
  /** Array of linked wallet records from the database. */
  wallets: Wallet[];
  /** Array of transaction records for the current user. */
  transactions: Transaction[];
  /** The authenticated user's UUID, passed to PlaidProvider. */
  userId: string;
  /** The authenticated user's display name for greeting. */
  userName: string;
  /** When true, renders the onboarding flow instead of the full dashboard. */
  showOnboarding: boolean;
}

/** Returns true when a transaction date falls within the last `days` days. */
function isWithinDays(date: Date | null, days: number): boolean {
  if (!date) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

/**
 * Client wrapper for the dashboard page.
 * Wraps content in PlaidProvider for bank-linking functionality.
 * Renders greeting header, section cards with real aggregated stats,
 * an area chart of transaction activity, a doughnut chart of balances,
 * and a linked banks overview.
 *
 * @export
 * @param {DashboardClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function DashboardClientWrapper({
  accounts,
  showOnboarding,
  transactions,
  userId,
  userName,
  wallets,
}: DashboardClientWrapperProps): JSX.Element {
  if (showOnboarding) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-12">
        <OnboardingFeed />
      </section>
    );
  }

  // ── Aggregated stats ────────────────────────────────────────────────────────
  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  const recentTx = transactions.filter((tx) => isWithinDays(tx.createdAt, 30));

  const monthlySpend = recentTx
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const monthlyCredits = recentTx
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const netChange = monthlyCredits - monthlySpend;
  const netChangePct = monthlySpend > 0 ? (netChange / monthlySpend) * 100 : 0;

  return (
    <section className="space-y-8">
      <header>
        <HeaderBox
          type="greeting"
          title="Welcome back,"
          user={userName}
          subtext="Here's your financial overview"
        />
      </header>

      {/* Total Balance Box - Hero balance display */}
      <TotalBalanceBox
        accounts={accounts}
        totalWallets={wallets.length}
        totalCurrentBalance={totalBalance}
      />

      {/* Key metric cards */}
      <SectionCards
        totalBalance={totalBalance}
        linkedBanks={wallets.length}
        monthlySpend={monthlySpend}
        netChange={netChange}
        netChangePct={netChangePct}
      />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartAreaInteractive transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
          <DoughnutChart accounts={accounts} />
        </div>
      </div>

      {/* Quick Actions + Linked Banks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <WalletsOverview
            walletsWithDetails={wallets.map((w) => ({
              ...w,
              balances: [],
              transactions: [],
            }))}
            totalBalance={totalBalance}
          />
        </div>

        <div className="md:col-span-2">
          <WalletsOverview
            walletsWithDetails={wallets.map((w) => ({
              ...w,
              balances: [],
              transactions: [],
            }))}
            totalBalance={totalBalance}
          />
        </div>
      </div>
    </section>
  );
}
