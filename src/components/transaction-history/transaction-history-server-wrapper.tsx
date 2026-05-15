import { redirect } from "next/navigation";

import { getTransactionHistory } from "@/actions/transaction.actions";
import TransactionHistoryClientWrapper from "@/components/layouts/transaction-history-client";
import { auth } from "@/lib/auth";

/**
 * Server wrapper for the Transaction History page.
 * Handles auth, fetches transactions, and delegates to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function TransactionHistoryServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getTransactionHistory(1, 50);
  const transactions = result.ok ? (result.transactions ?? []) : [];

  return <TransactionHistoryClientWrapper transactions={transactions} />;
}
