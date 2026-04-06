import type { Metadata } from "next";
import type { JSX } from "react";

import { redirect } from "next/navigation";

import { getAllAccounts } from "@/actions/plaid.actions";
import { getRecentTransactions } from "@/actions/transaction.actions";
import { getUserWallets } from "@/actions/wallet.actions";
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";
import { auth } from "@/lib/auth";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Your financial overview",
  title: "Dashboard | Banking",
};

/**
 * Server wrapper for the dashboard page.
 * Handles authentication, fetches the user's linked banks, accounts, and
 * recent transactions in parallel, then passes all data to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function DashboardServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  const [walletsResult, accountsResult, txResult] = await Promise.all([
    getUserWallets(),
    getAllAccounts(),
    getRecentTransactions(20),
  ]);

  const wallets = walletsResult.ok ? (walletsResult.wallets ?? []) : [];
  const accounts = accountsResult.ok ? (accountsResult.accounts ?? []) : [];
  const transactions = txResult.ok ? (txResult.transactions ?? []) : [];

  return (
    <DashboardClientWrapper
      accounts={accounts}
      wallets={wallets}
      transactions={transactions}
      userId={userId}
      userName={session.user.name ?? "User"}
      showOnboarding={wallets.length === 0}
    />
  );
}
