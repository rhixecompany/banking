"use server";
import type { Transaction } from "@/types/transaction";

import { auth } from "@/lib/auth";
import { transactionDal } from "@/lib/dal";

/**
 * Returns the most recent transactions for the authenticated user, up to the given limit.
 *
 * @export
 * @async
 * @param {number} [limit=10] - Maximum number of transactions to return
 * @returns {Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }>}
 */
export async function getRecentTransactions(
  limit = 10,
): Promise<{ ok: boolean; transactions?: Transaction[]; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const userId = session.user.id;
  const transactions = await transactionDal.findByUserId(userId, limit);
  return { ok: true, transactions };
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const userId = session.user.id;
  const offset = (page - 1) * pageSize;
  const transactions = await transactionDal.findByUserId(
    userId,
    pageSize,
    offset,
  );
  return { ok: true, transactions };
}
