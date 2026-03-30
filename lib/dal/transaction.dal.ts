import { desc, eq, sql } from "drizzle-orm";

import type { Transaction, TransactionStats } from "@/types/transaction";

import { db } from "@/database/db";
import { transactions } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @class TransactionDal
 * @typedef {TransactionDal}
 */
export class TransactionDal {
  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async findById(id: string): Promise<Transaction | undefined> {
    const [txn] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return txn;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {number} [limitVal=50]
   * @param {number} [offsetVal=0]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} bankId
   * @returns {unknown}
   */
  findByBankId(bankId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.senderBankId, bankId))
      .orderBy(desc(transactions.createdAt));
  }

  /**
   * Description placeholder
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
   *   }} data
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {unknown}
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
 * Description placeholder
 *
 * @type {TransactionDal}
 */
export const transactionDal = new TransactionDal();
