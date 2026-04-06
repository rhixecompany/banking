import { and, desc, eq, isNull, sql } from "drizzle-orm";

import type { Transaction, TransactionStats } from "@/types/transaction";

import { db } from "@/database/db";
import { transactions } from "@/database/schema";

/**
 * Data access layer for the `transactions` table.
 * Provides methods for querying and inserting transaction records.
 * All queries automatically exclude soft-deleted records.
 */
export class TransactionDal {
  /**
   * Finds a single transaction by its primary key.
   * Excludes soft-deleted records.
   *
   * @async
   * @param {string} id - The transaction ID to look up.
   * @returns {Promise<Transaction | undefined>} The matching transaction, or undefined.
   */
  async findById(id: string): Promise<Transaction | undefined> {
    const [txn] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), isNull(transactions.deletedAt)))
      .limit(1);
    return txn;
  }

  /**
   * Retrieves a paginated list of transactions for a given user, ordered by most recent first.
   * Excludes soft-deleted records.
   *
   * @param {string} userId - The ID of the user whose transactions to fetch.
   * @param {number} [limitVal=50] - Maximum number of records to return.
   * @param {number} [offsetVal=0] - Number of records to skip.
   * @returns {Promise<Transaction[]>} List of matching transactions.
   */
  findByUserId(
    userId: string,
    limitVal = 50,
    offsetVal = 0,
  ): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), isNull(transactions.deletedAt)),
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limitVal)
      .offset(offsetVal);
  }

  /**
   * Retrieves all transactions where the given bank is the sender, ordered by most recent first.
   * Excludes soft-deleted records.
   *
   * @param {string} walletId - The wallet ID to filter by senderWalletId.
   * @returns {Promise<Transaction[]>} List of matching transactions.
   */
  findByWalletId(walletId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.senderWalletId, walletId),
          isNull(transactions.deletedAt),
        ),
      )
      .orderBy(desc(transactions.createdAt));
  }

  /**
   * Inserts a new transaction record and returns the created row.
   *
   * @async
   * @param {{
   *     userId: string;
   *     senderWalletId?: string;
   *     receiverWalletId?: string;
   *     name?: string;
   *     email?: string;
   *     amount: string;
   *     type?: "credit" | "debit";
   *     status?: "pending" | "processing" | "completed" | "failed" | "cancelled";
   *     channel?: "online" | "in_store" | "other";
   *     category?: string;
   *     currency?: string;
   *   }} data - Transaction fields to insert.
   * @returns {Promise<Transaction>} The newly created transaction record.
   */
  async createTransaction(data: {
    userId: string;
    senderWalletId?: string;
    receiverWalletId?: string;
    name?: string;
    email?: string;
    amount: string;
    type?: "credit" | "debit";
    status?: "cancelled" | "completed" | "failed" | "pending" | "processing";
    channel?: "in_store" | "online" | "other";
    category?: string;
    currency?: string;
  }): Promise<Transaction> {
    const [txn] = await db.insert(transactions).values(data).returning();
    return txn;
  }

  /**
   * Returns aggregated transaction statistics grouped by type for a user.
   *
   * @async
   * @param {string} userId - The ID of the user to aggregate stats for.
   * @returns {Promise<TransactionStats[]>} Aggregated stats records.
   */
  async getStatsByUser(userId: string): Promise<TransactionStats[]> {
    const result = await db
      .select({
        count: sql<number>`COUNT(*)`,
        total: sql<string>`SUM(CAST(${transactions.amount} AS DECIMAL))`,
        type: transactions.type,
      })
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), isNull(transactions.deletedAt)),
      )
      .groupBy(transactions.type);

    return result;
  }
}

/**
 * Singleton instance of {@link TransactionDal} for use throughout the application.
 */
export const transactionDal = new TransactionDal();
