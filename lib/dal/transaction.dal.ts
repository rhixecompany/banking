import { desc, eq, sql } from "drizzle-orm";

import type { Transaction, TransactionStats } from "@/types/transaction";

import { db } from "@/database/db";
import { transactions } from "@/database/schema";

/**
 * Data access layer for the `transactions` table.
 * Provides methods for querying and inserting transaction records.
 *
 * @export
 * @class TransactionDal
 * @typedef {TransactionDal}
 */
export class TransactionDal {
  /**
   * Finds a single transaction by its primary key.
   *
   * @async
   * @param {string} id - The transaction ID to look up.
   * @returns {Promise<Transaction | undefined>} The matching transaction, or `undefined` if not found.
   */
  async findById(id: string): Promise<Transaction | undefined> {
    const [txn] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return txn;
  }

  /**
   * Retrieves a paginated list of transactions for a given user, ordered by most recent first.
   *
   * @param {string} userId - The ID of the user whose transactions to fetch.
   * @param {number} [limitVal=50] - Maximum number of records to return (default: 50).
   * @param {number} [offsetVal=0] - Number of records to skip for pagination (default: 0).
   * @returns {Promise<Transaction[]>} The list of matching transactions.
   */
  findByUserId(
    userId: string,
    limitVal = 50,
    offsetVal = 0,
  ): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limitVal)
      .offset(offsetVal);
  }

  /**
   * Retrieves all transactions where the given bank is the sender, ordered by most recent first.
   *
   * @param {string} bankId - The bank ID to filter by `senderBankId`.
   * @returns {Promise<Transaction[]>} The list of matching transactions.
   */
  findByBankId(bankId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.senderBankId, bankId))
      .orderBy(desc(transactions.createdAt));
  }

  /**
   * Inserts a new transaction record and returns the created row.
   *
   * @async
   * @param {{
   *     userId: string;
   *     senderBankId?: string;
   *     receiverBankId?: string;
   *     name?: string;
   *     email?: string;
   *     amount: string;
   *     type?: string;
   *     status?: string;
   *     channel?: string;
   *     category?: string;
   *   }} data - Transaction fields to insert.
   * @returns {Promise<Transaction>} The newly created transaction record.
   */
  async createTransaction(data: {
    userId: string;
    senderBankId?: string;
    receiverBankId?: string;
    name?: string;
    email?: string;
    amount: string;
    type?: string;
    status?: string;
    channel?: string;
    category?: string;
    currency?: string;
  }): Promise<Transaction> {
    const [txn] = await db.insert(transactions).values(data).returning();
    return txn;
  }

  /**
   * Returns aggregated transaction statistics (count, total amount) grouped by type for a user.
   *
   * @async
   * @param {string} userId - The ID of the user to aggregate stats for.
   * @returns {Promise<TransactionStats[]>} Aggregated stats records grouped by transaction type.
   */
  async getStatsByUser(userId: string): Promise<TransactionStats[]> {
    const result = await db
      .select({
        count: sql<number>`COUNT(*)`,
        total: sql<string>`SUM(CAST(${transactions.amount} AS DECIMAL))`,
        type: transactions.type,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);

    return result;
  }
}

/**
 * Singleton instance of {@link TransactionDal} for use throughout the application.
 *
 * @type {TransactionDal}
 */
export const transactionDal = new TransactionDal();
