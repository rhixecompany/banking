import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "@/database/db";
import { transactions, user_profiles, users, wallets } from "@/database/schema";
import * as logger from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @class AdminDal
 * @typedef {AdminDal}
 */
export class AdminDal {
  /**
   * Get basic admin statistics: total users, total wallets, total transactions
   */
  async getStats() {
    try {
      // Get counts in parallel for better performance
      const [
        userCountResult,
        walletCountResult,
        transactionCountResult,
        transactionAmountResult,
        recentTransactionCountResult,
      ] = await Promise.all([
        db.select({ count: count(users.id) }).from(users),
        db.select({ count: count(wallets.id) }).from(wallets),
        db.select({ count: count(transactions.id) }).from(transactions),
        db
          .select({
            count: count(transactions.id),
            total: sql<number>`sum(CAST(${transactions.amount} AS DECIMAL(12,2)))`,
          })
          .from(transactions),
        db
          .select({ count: count(transactions.id) })
          .from(transactions)
          .where(
            gte(
              transactions.createdAt,
              // Last 30 days
              sql`NOW() - INTERVAL '30 days'`,
            ),
          ),
      ]);

      return {
        recentTransactionCount: Number(recentTransactionCountResult[0].count),
        totalAmount: Number(transactionAmountResult[0].total || 0),
        totalTransactions: Number(transactionCountResult[0].count),
        totalUsers: Number(userCountResult[0].count),
        totalWallets: Number(walletCountResult[0].count),
      };
    } catch (e) {
      // Defensive fallback: return zeros and log the failure for diagnostics
      try {
        logger.error("AdminDal", "getStats failed", { error: String(e) });
      } catch {
        // ignore logging errors
      }

      return {
        recentTransactionCount: 0,
        totalAmount: 0,
        totalTransactions: 0,
        totalUsers: 0,
        totalWallets: 0,
      };
    }
  }

  /**
   * Get transaction statistics by status
   */
  async getTransactionStatusStats() {
    try {
      const results = await db
        .select({
          count: count(transactions.id),
          status: transactions.status,
        })
        .from(transactions)
        .groupBy(transactions.status);

      // Initialize all statuses with zero
      const statusCounts: Record<string, number> = {
        cancelled: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        processing: 0,
      };

      // Fill in actual counts
      for (const row of results) {
        if (row.status) {
          statusCounts[row.status as string] = Number(row.count);
        }
      }

      return statusCounts;
    } catch (e) {
      logger.error("AdminDal", "getTransactionStatusStats failed", {
        error: String(e),
      });
      return {
        cancelled: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        processing: 0,
      };
    }
  }

  /**
   * Get transaction statistics by type (credit/debit)
   */
  async getTransactionTypeStats() {
    try {
      const results = await db
        .select({
          count: count(transactions.id),
          type: transactions.type,
        })
        .from(transactions)
        .groupBy(transactions.type);

      // Initialize types with zero
      const typeCounts: Record<string, number> = {
        credit: 0,
        debit: 0,
      };

      // Fill in actual counts
      for (const row of results) {
        if (row.type) {
          typeCounts[row.type as string] = Number(row.count);
        }
      }

      return typeCounts;
    } catch (e) {
      logger.error("AdminDal", "getTransactionTypeStats failed", {
        error: String(e),
      });
      return { credit: 0, debit: 0 };
    }
  }

  /**
   * Get recent transactions for admin dashboard
   */
  async getRecentTransactions(limit = 10) {
    try {
      const results = await db
        .select({
          amount: transactions.amount,
          createdAt: transactions.createdAt,
          id: transactions.id,
          name: transactions.name,
          // Join with wallets to get wallet info
          senderWalletId: wallets.id,
          senderWalletName: wallets.institutionName,
          status: transactions.status,
          type: transactions.type,
          userEmail: users.email,
          // Join with user to get user info
          userId: users.id,
          userName: users.name,
        })
        .from(transactions)
        .leftJoin(users, eq(transactions.userId, users.id))
        .leftJoin(wallets, eq(transactions.senderWalletId, wallets.id))
        .orderBy(desc(transactions.createdAt))
        .limit(limit);

      return results.map((tx) => ({
        amount: Number(tx.amount),
        createdAt: tx.createdAt.toISOString(),
        id: tx.id,
        name: tx.name ?? "Unknown Transaction",
        status: tx.status ?? "pending",
        type: tx.type ?? "debit",
        user: {
          email: tx.userEmail ?? "",
          id: tx.userId ?? undefined,
          name: tx.userName ?? "Unknown User",
        },
        wallet: {
          id: tx.senderWalletId ?? "unknown-wallet",
          name: tx.senderWalletName ?? "Unknown Wallet",
        },
      }));
    } catch (e) {
      logger.error("AdminDal", "getRecentTransactions failed", {
        error: String(e),
        limit,
      });
      return [];
    }
  }

  /**
   * Get users with pagination and search
   */
  async getUsersPaginated({
    page = 1,
    pageSize = 10,
    search = "",
  }: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) {
    const offset = (page - 1) * pageSize;

    // Build where clause for search
    const whereConditionsArray: SQL<unknown>[] = [];
    if (search) {
      const searchCondition = or(
        ilike(users.email, `%${search}%`),
        ilike(users.name, `%${search}%`),
      );
      if (searchCondition) {
        whereConditionsArray.push(searchCondition);
      }
    }

    try {
      // Get total count for pagination
      const countResult = await db
        .select({ count: count() })
        .from(users)
        .where(
          whereConditionsArray.length > 0
            ? and(...whereConditionsArray)
            : undefined,
        );

      const totalCount = Number(countResult[0].count);

      // Get users with their profile info
      const usersResult = await db
        .select({
          createdAt: users.createdAt,
          email: users.email,
          id: users.id,
          isActive: users.isActive,
          isAdmin: users.isAdmin,
          name: users.name,
          // Profile info
          profileAddress: user_profiles.address,
          profileCity: user_profiles.city,
          profilePhone: user_profiles.phone,
          profilePostalCode: user_profiles.postalCode,
          profileState: user_profiles.state,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
        .where(
          whereConditionsArray.length > 0
            ? and(...whereConditionsArray)
            : undefined,
        )
        .orderBy(desc(users.createdAt))
        .limit(pageSize)
        .offset(offset);

      return {
        pagination: {
          page,
          pageSize,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
        users: usersResult.map((user) => ({
          createdAt: user.createdAt.toISOString(),
          email: user.email,
          id: user.id,
          isActive: user.isActive ?? false,
          isAdmin: user.isAdmin ?? false,
          name: user.name ?? "",
          profile: {
            address: user.profileAddress,
            city: user.profileCity,
            phone: user.profilePhone,
            postalCode: user.profilePostalCode,
            state: user.profileState,
          },
          updatedAt: user.updatedAt.toISOString(),
        })),
      };
    } catch (e) {
      logger.error("AdminDal", "getUsersPaginated failed", {
        error: String(e),
        page,
        pageSize,
        search,
      });
      return {
        pagination: {
          page,
          pageSize,
          totalItems: 0,
          totalPages: 0,
        },
        users: [],
      };
    }
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {AdminDal}
 */
export const adminDal = new AdminDal();
