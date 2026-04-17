import { and, desc, eq, isNull, or, sql } from "drizzle-orm";

import type { Transaction, TransactionStats } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";

import { db } from "@/database/db";
import { transactions, wallets } from "@/database/schema";

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
  async createTransaction(
    data: {
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
    },
    opts?: { db?: unknown },
  ): Promise<Transaction> {
    // Allow callers to pass a transaction-scoped DB instance via opts.db.
    // Use unknown to accept Drizzle transaction-scoped DB instances and cast
    // to the shared `typeof db` shape at runtime.
    const database = (opts?.db ?? db) as typeof db;
    const [txn] = await database.insert(transactions).values(data).returning();
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

  /**
   * Finds transactions for a user and eagerly loads related wallet metadata
   * for sender and receiver wallets to avoid N+1 queries in UI code.
   * Returns transactions with optional senderWallet and receiverWallet fields.
   */
  async findByUserIdWithWallets(
    userId: string,
    limitVal = 50,
    offsetVal = 0,
  ): Promise<
    ({
      senderWallet?: null | Pick<
        Wallet,
        "fundingSourceUrl" | "id" | "institutionName"
      >;
      receiverWallet?: null | Pick<
        Wallet,
        "fundingSourceUrl" | "id" | "institutionName"
      >;
    } & Transaction)[]
  > {
    // Previous implementation attempted to join the wallets table twice which
    // can cause alias collisions depending on the Drizzle version. To avoid
    // that complexity and reliably prevent N+1 queries, fetch transactions
    // first, collect unique sender/receiver wallet IDs, load those wallets in
    // one batch, then map them back onto the transactions. This keeps the
    // DAL implementation portable and easy to reason about.

    const txns = await db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), isNull(transactions.deletedAt)),
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limitVal)
      .offset(offsetVal);

    // Collect unique wallet ids referenced by these transactions
    const walletIds = new Set<string>();
    for (const t of txns) {
      if (t.senderWalletId) walletIds.add(t.senderWalletId);
      if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
    }

    let walletsMap: Record<
      string,
      Pick<Wallet, "fundingSourceUrl" | "id" | "institutionName">
    > = {};
    if (walletIds.size > 0) {
      const ids = Array.from(walletIds);
      // Build OR conditions for each id: (wallets.id = id1 OR wallets.id = id2 ...)
      const conditions = ids.map((id) => eq(wallets.id, id));
      const rows = await db
        .select({
          fundingSourceUrl: wallets.fundingSourceUrl,
          id: wallets.id,
          institutionName: wallets.institutionName,
        })
        .from(wallets)
        .where(conditions.length === 1 ? conditions[0] : or(...conditions));

      // Build map for quick lookup
      // rows shape: { fundingSourceUrl, id, institutionName }
      walletsMap = rows.reduce(
        (
          acc: Record<string, { fundingSourceUrl: string | null; id: string; institutionName: string | null }>,
          w: { fundingSourceUrl?: string | null; id: string; institutionName?: string | null },
        ) => {
          const id = String(w.id);
          acc[id] = {
            fundingSourceUrl: w.fundingSourceUrl ?? null,
            id,
            institutionName: w.institutionName ?? null,
          };
          return acc;
        },
        {} as Record<string, { fundingSourceUrl: string | null; id: string; institutionName: string | null }>,
      );
    }

    // Attach optional wallet metadata to each transaction
    return txns.map((txn) => ({
      ...txn,
      receiverWallet: txn.receiverWalletId
        ? (walletsMap[txn.receiverWalletId] ?? null)
        : null,
      senderWallet: txn.senderWalletId
        ? (walletsMap[txn.senderWalletId] ?? null)
        : null,
    }));
  }
}

/**
 * Singleton instance of {@link TransactionDal} for use throughout the application.
 */
export const transactionDal = new TransactionDal();
