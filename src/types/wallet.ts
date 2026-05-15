import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";

import { wallets } from "@/database/schema";

/**
 * Wallet record type derived from Drizzle schema.
 * Includes soft-delete deletedAt field and Dwolla integration fields.
 *
 * @export
 * @typedef {Wallet}
 */
export type Wallet = InferSelectModel<typeof wallets>;

/**
 * New wallet record type for inserting wallet records.
 * Excludes auto-generated fields like id, createdAt, updatedAt.
 *
 * @export
 * @typedef {NewWallet}
 */
export type NewWallet = InferInsertModel<typeof wallets>;

/**
 * A wallet record enriched with live Plaid balance and transaction data.
 * Used for dashboard display of account details.
 *
 * @export
 * @interface WalletWithDetails
 * @augments {Wallet}
 */
export interface WalletWithDetails extends Wallet {
  /** Live balance snapshots from Plaid. */
  balances: PlaidBalance[];
  /** Recent transactions fetched from Plaid. */
  transactions: PlaidTransaction[];
}

/**
 * Summary of all wallets for a user.
 * Aggregates data across multiple linked wallets.
 *
 * @export
 * @interface WalletsSummary
 */
export interface WalletsSummary {
  /** Total number of linked wallet accounts. */
  totalWallets: number;
  /** Sum of current balances across all wallets. */
  totalCurrentBalance: number;
  /** Array of wallet records with details. */
  wallets: WalletWithDetails[];
}
