"use server";
import type { Transaction } from "@/types/transaction";

import { auth } from "@/lib/auth";
import { transactionDal } from "@/lib/dal";

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {number} [limit=10]
 * @returns {unknown}
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
 * Description placeholder
 *
 * @export
 * @async
 * @param {number} [page=1]
 * @param {number} [pageSize=20]
 * @returns {unknown}
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
