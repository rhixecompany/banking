import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { TransactionHistoryClient } from "@/components/transaction-history/TransactionHistoryClient";
import { getTransactionHistory } from "@/lib/actions/transaction.actions";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  description: "Browse your full transaction history.",
  title: "Transaction History | Horizon Banking",
};

/**
 * Transaction History page — fetches transactions server-side
 * and passes them to the client datatable.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function TransactionHistoryPage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getTransactionHistory(1, 50);
  const transactions = result.ok ? (result.transactions ?? []) : [];

  return <TransactionHistoryClient transactions={transactions} />;
}
