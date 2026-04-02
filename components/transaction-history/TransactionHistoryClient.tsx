"use client";

import type { Item } from "@/components/shadcn-studio/blocks/datatable-transaction";
import type { Transaction } from "@/types/transaction";

import HeaderBox from "@/components/HeaderBox";
import TransactionDatatable from "@/components/shadcn-studio/blocks/datatable-transaction";

/** Maps a DB Transaction row to the Item shape expected by TransactionDatatable. */
function toItem(tx: Transaction): Item {
  const validStatuses = new Set<Item["status"]>([
    "failed",
    "paid",
    "pending",
    "processing",
  ]);

  const rawStatus = tx.status ?? "pending";
  const status: Item["status"] = validStatuses.has(rawStatus as Item["status"])
    ? (rawStatus as Item["status"])
    : "pending";

  // Build initials from name for the avatar fallback
  const displayName = tx.name ?? tx.email ?? "Unknown";
  const parts = displayName.trim().split(/\s+/);
  const avatarFallback =
    parts.length >= 2
      ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

  return {
    amount: Number(tx.amount),
    avatar: "",
    avatarFallback,
    email: tx.email ?? "",
    id: tx.id,
    name: displayName,
    paidBy: "visa",
    status,
  };
}

/**
 * Props for TransactionHistoryClient.
 *
 * @interface TransactionHistoryClientProps
 */
interface TransactionHistoryClientProps {
  /** List of transactions fetched server-side. */
  transactions: Transaction[];
}

/**
 * Client component that renders the transaction history datatable.
 *
 * @export
 * @param {TransactionHistoryClientProps} props
 * @returns {JSX.Element}
 */
export function TransactionHistoryClient({
  transactions,
}: TransactionHistoryClientProps): JSX.Element {
  const items: Item[] = transactions.map(toItem);

  return (
    <section className="space-y-6">
      <header>
        <HeaderBox
          title="Transaction History"
          subtext="A complete record of all your account activity."
        />
      </header>

      <div className="rounded-lg border bg-card">
        <TransactionDatatable data={items} />
      </div>
    </section>
  );
}
