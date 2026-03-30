import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { transactions } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {Transaction}
 */
export type Transaction = InferSelectModel<typeof transactions>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewTransaction}
 */
export type NewTransaction = InferInsertModel<typeof transactions>;

/**
 * Description placeholder
 *
 * @export
 * @interface TransactionStats
 * @typedef {TransactionStats}
 */
export interface TransactionStats {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  count: number;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  total: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  type: null | string;
}
