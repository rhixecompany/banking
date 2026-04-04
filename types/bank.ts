import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";

import { banks } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {Bank}
 */
export type Bank = InferSelectModel<typeof banks>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewBank}
 */
export type NewBank = InferInsertModel<typeof banks>;

/**
 * A bank record enriched with live Plaid balance and transaction data.
 *
 * @export
 * @interface BankWithDetails
 * @augments {Bank}
 */
export interface BankWithDetails extends Bank {
  /** Live balance snapshots from Plaid. */
  balances: PlaidBalance[];
  /** Recent transactions fetched from Plaid. */
  transactions: PlaidTransaction[];
}
