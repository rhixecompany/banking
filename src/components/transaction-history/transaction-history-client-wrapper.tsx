"use client";

import type { Item } from "@/components/shadcn-studio/blocks/datatable-transaction";
import type { Transaction } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";

import HeaderBox from "@/components/header-box/header-box";
import TransactionDatatable from "@/components/shadcn-studio/blocks/datatable-transaction";
import { FilterStoreProvider } from "@/stores/filter-store";

/**
 * Maps a DB Transaction row to the Item shape expected by TransactionDatatable.
 *
 * Fix: paidBy is derived from tx.channel instead of hardcoded "visa".
 * - channel === "in store" → "mastercard"
 * - everything else (online, null, unknown) → "visa"
 */
function toItem(
  tx: {
    senderWallet?: null | Pick<
      Wallet,
      "fundingSourceUrl" | "id" | "institutionName"
    >;
    receiverWallet?: null | Pick<
      Wallet,
      "fundingSourceUrl" | "id" | "institutionName"
    >;
  } & Transaction,
): Item {
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

  // Derive paidBy from channel — "in_store" maps to mastercard, all others to visa
  const paidBy: Item["paidBy"] =
    tx.channel === "in_store" ? "mastercard" : "visa";

  return {
    amount: Number(tx.amount),
    // Prefer using the wallet institution name for avatar and email where
    // available to give the table more useful context without extra queries.
    avatar: tx.senderWallet?.institutionName ?? "",
    avatarFallback,
    email: tx.email ?? tx.senderWallet?.institutionName ?? "",
    id: tx.id,
    name: displayName,
    paidBy,
    status,
  };
}

/**
 * Props for TransactionHistoryClientWrapper.
 *
 * @interface TransactionHistoryClientWrapperProps
 */
interface TransactionHistoryClientWrapperProps {
  /** List of transactions fetched server-side. */
  transactions: ({
    senderWallet?: null | Pick<
      Wallet,
      "fundingSourceUrl" | "id" | "institutionName"
    >;
    receiverWallet?: null | Pick<
      Wallet,
      "fundingSourceUrl" | "id" | "institutionName"
    >;
  } & Transaction)[];
}

/**
 * Client wrapper that renders the transaction history datatable.
 *
 * @export
 * @param {TransactionHistoryClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function TransactionHistoryClientWrapper({
  transactions,
}: TransactionHistoryClientWrapperProps): JSX.Element {
  const items: Item[] = transactions.map(toItem);

  return (
    <FilterStoreProvider>
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
    </FilterStoreProvider>
  );
}
