import { db } from "@/database/db";
import { transactions } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";

export class TransactionDal {
  async findById(id: string) {
    const [txn] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return txn;
  }

  async findByUserId(userId: string, limitVal = 50, offsetVal = 0) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limitVal)
      .offset(offsetVal);
  }

  async findByBankId(bankId: string) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.senderBankId, bankId))
      .orderBy(desc(transactions.createdAt));
  }

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
  }) {
    const [txn] = await db.insert(transactions).values(data).returning();
    return txn;
  }

  async getStatsByUser(userId: string) {
    const result = await db
      .select({
        type: transactions.type,
        total: sql<string>`SUM(CAST(${transactions.amount} AS DECIMAL))`,
        count: sql<number>`COUNT(*)`,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.type);

    return result;
  }
}

export const transactionDal = new TransactionDal();
