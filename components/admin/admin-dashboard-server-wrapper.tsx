"use server";

import {
  getAdminStats,
  getRecentTransactions,
  getTransactionStatusStats,
  getTransactionTypeStats,
} from "@/actions/admin-stats.actions";
import AdminDashboardContent from "@/components/admin/admin-dashboard-content";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Server wrapper for the admin dashboard.
 * Fetches data from the database and passes it to the client component.
 */
export async function AdminDashboardServerWrapper() {
  // Authenticate and ensure admin guard — layout also protects admin routes,
  // but server wrappers should explicitly verify auth/isAdmin before fetching.
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  if (!session.user.isAdmin) {
    redirect("/dashboard");
  }

  // Fetch all required data in parallel
  const [
    statsResult,
    recentTransactionsResult,
    transactionStatusStatsResult,
    transactionTypeStatsResult,
  ] = await Promise.all([
    getAdminStats({}),
    getRecentTransactions({ limit: 5 }),
    getTransactionStatusStats({}),
    getTransactionTypeStats({}),
  ]);

  // Prepare data for the client component
  const stats = statsResult.ok ? statsResult.stats : undefined;
  const recentTransactions = recentTransactionsResult.ok
    ? recentTransactionsResult.transactions
    : [];
  const transactionStatusStats = transactionStatusStatsResult.ok
    ? transactionStatusStatsResult.statusStats
    : {};
  const transactionTypeStats = transactionTypeStatsResult.ok
    ? transactionTypeStatsResult.typeStats
    : {};

  return (
    <AdminDashboardContent
      stats={stats}
      recentTransactions={recentTransactions}
      transactionStatusStats={transactionStatusStats}
      transactionTypeStats={transactionTypeStats}
    />
  );
}
