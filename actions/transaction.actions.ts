"use server";

import type { Transaction } from "@/types/transaction";

import { transactionDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Returns the most recent transactions for the authenticated user, up to the given limit.
 *
 * This action is defensive: it catches and logs unexpected errors and returns
 * a stable error shape instead of letting exceptions propagate to the server
 * rendering path. This prevents flakiness during Playwright E2E runs.
 *
 * @export
 * @async
 * @param {number} [limit=10] - Maximum number of transactions to return
 * @returns {Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }>}
 */
export async function getRecentTransactions(
  limit = 10,
): Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }> {
  // Validate inputs to satisfy server-action-zod rule and provide useful
  // error messages instead of throwing. Keep defaults and coercion minimal.
  const LimitSchema = z.number().int().positive().max(100).default(10);
  const parsedLimit = LimitSchema.safeParse(limit);
  if (!parsedLimit.success) {
    return { ok: false, error: parsedLimit.error.issues[0].message };
  }
  limit = parsedLimit.data;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated", ok: false };
    }

    const userId = session.user.id;
    // Use eager-loaded helper to include basic wallet metadata (sender/receiver)
    // to avoid N+1 queries in UI code. The DAL returns Transaction rows with
    // optional senderWallet/receiverWallet fields.
    const transactions = await transactionDal.findByUserIdWithWallets(
      userId,
      limit,
    );
    return { ok: true, transactions };
  } catch (error) {
    logger.error("getRecentTransactions error:", error);
    return { error: "Failed to get recent transactions", ok: false };
  }
}

/**
 * Returns a paginated list of transactions for the authenticated user.
 *
 * @export
 * @async
 * @param {number} [page=1] - 1-based page number
 * @param {number} [pageSize=20] - Number of transactions per page
 * @returns {Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }>}
 */
export async function getTransactionHistory(
  page = 1,
  pageSize = 20,
): Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }> {
  // Validate pagination inputs
  const PageSchema = z.number().int().min(1).default(1);
  const PageSizeSchema = z.number().int().min(1).max(200).default(20);
  const p = PageSchema.safeParse(page);
  const ps = PageSizeSchema.safeParse(pageSize);
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  if (!ps.success) return { ok: false, error: ps.error.issues[0].message };
  page = p.data;
  pageSize = ps.data;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated", ok: false };
    }

    const userId = session.user.id;
    const offset = (page - 1) * pageSize;
    // Use the eager-loaded variant to include wallet metadata for each
    // transaction so client-side components don't need additional DAL calls.
    const transactions = await transactionDal.findByUserIdWithWallets(
      userId,
      pageSize,
      offset,
    );
    return { ok: true, transactions };
  } catch (error) {
    logger.error("getTransactionHistory error:", error);
    return { error: "Failed to get transaction history", ok: false };
  }
}
