import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { transactions } from "@/database/schema";

/**
 * Transaction type derived from Drizzle schema.
 * Includes soft-delete deletedAt field and typed enums.
 */
export type Transaction = InferSelectModel<typeof transactions>;
/**
 * NewTransaction type for inserting transactions.
 * @export
 */
export type NewTransaction = InferInsertModel<typeof transactions>;

/**
 * Aggregated transaction statistics for a user.
 * Used for dashboard spending breakdowns.
 */
export interface TransactionStats {
  /** Total number of transactions in this group. */
  count: number;
  /** Sum of all transaction amounts as a decimal string. */
  total: null | string;
  /** Transaction type ("credit" or "debit") for this group. */
  type: null | string;
}
