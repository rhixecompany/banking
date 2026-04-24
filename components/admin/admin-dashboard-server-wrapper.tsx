import { redirect } from "next/navigation";

import {
  getAdminStats,
  getRecentTransactions,
  getTransactionStatusStats,
  getTransactionTypeStats,
} from "@/actions/admin-stats.actions";
import AdminDashboardContent from "@/components/layouts/admin-dashboard";
import { auth } from "@/lib/auth";

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

  // Log any action-level errors for observability (non-blocking)
  try {
    const { error: logError } = await import("@/lib/logger");
    if (!statsResult.ok) {
      logError("admin-dashboard.wrapper", "getAdminStats failed", {
        error: statsResult.error,
      });
    }
    if (!recentTransactionsResult.ok) {
      logError("admin-dashboard.wrapper", "getRecentTransactions failed", {
        error: recentTransactionsResult.error,
      });
    }
    if (!transactionStatusStatsResult.ok) {
      logError("admin-dashboard.wrapper", "getTransactionStatusStats failed", {
        error: transactionStatusStatsResult.error,
      });
    }
    if (!transactionTypeStatsResult.ok) {
      logError("admin-dashboard.wrapper", "getTransactionTypeStats failed", {
        error: transactionTypeStatsResult.error,
      });
    }
  } catch {
    // ignore logging failures
  }

  return (
    <AdminDashboardContent
      stats={stats}
      recentTransactions={recentTransactions}
      transactionStatusStats={transactionStatusStats}
      transactionTypeStats={transactionTypeStats}
    />
  );
}
