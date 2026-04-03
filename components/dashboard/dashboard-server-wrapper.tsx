import type { Metadata } from "next";
import type { JSX } from "react";

import { redirect } from "next/navigation";

import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";
import { getUserBanks } from "@/lib/actions/bank.actions";
import { getAllAccounts } from "@/lib/actions/plaid.actions";
import { getRecentTransactions } from "@/lib/actions/transaction.actions";
import { auth } from "@/lib/auth";

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

  const [banksResult, accountsResult, txResult] = await Promise.all([
    getUserBanks(),
    getAllAccounts(),
    getRecentTransactions(20),
  ]);

  const banks = banksResult.ok ? (banksResult.banks ?? []) : [];
  const accounts = accountsResult.ok ? (accountsResult.accounts ?? []) : [];
  const transactions = txResult.ok ? (txResult.transactions ?? []) : [];

  return (
    <DashboardClientWrapper
      accounts={accounts}
      banks={banks}
      transactions={transactions}
      userId={userId}
      userName={session.user.name ?? "User"}
      showOnboarding={banks.length === 0}
    />
  );
}
