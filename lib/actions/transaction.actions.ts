"use server";
import { auth } from "@/lib/auth";
import { transactionDal } from "@/lib/dal";

export async function getRecentTransactions(limit = 10) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const userId = parseInt(session.user.id);
  const transactions = await transactionDal.findByUserId(userId, limit);
  return { ok: true, transactions };
}

export async function getTransactionHistory(page = 1, pageSize = 20) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const userId = parseInt(session.user.id);
  const offset = (page - 1) * pageSize;
  const transactions = await transactionDal.findByUserId(
    userId,
    pageSize,
    offset,
  );
  return { ok: true, transactions };
}
