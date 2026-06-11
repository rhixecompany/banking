"use server";

import { z } from "zod";

import { adminDal } from "@/dal";
import { auth } from "@/lib/auth";
import {
  AdminStats,
  AdminTransaction,
  GetAdminStatsSchema,
  PaginatedUsers,
} from "@/lib/validations/admin";

/**
 * Get admin dashboard statistics.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must be an empty object
 * @returns {Promise<{ ok: boolean; stats?: AdminStats; error?: string }>}
 */
export async function getAdminStats(
  input: unknown,
): Promise<{ ok: boolean; stats?: AdminStats; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", ok: false };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", ok: false };
  }

  const parsed = GetAdminStatsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.message,
      ok: false,
    };
  }

  try {
    const stats = await adminDal.getStats();
    return { ok: true, stats };
  } catch (err) {
    // Structured log for easier parsing in production logs.
    try {
      const { error: e } = (err as any) ?? {};
      // Lazy import logger to avoid adding runtime cost where not needed
      const { error: logError } = await import("@/lib/logger");
      logError("admin-stats.getAdminStats", "Failed to get admin stats", {
        extra: e,
        message: String((err as any)?.message ?? err),
        stack: (err as any)?.stack,
      });
    } catch {
      // swallow logging errors
    }
    return { error: "Failed to load statistics", ok: false };
  }
}

/**
 * Get transaction status statistics.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must be an empty object
 * @returns {Promise<{ ok: boolean; statusStats?: Record<string, number>; error?: string }>}
 */
export async function getTransactionStatusStats(input: unknown): Promise<{
  ok: boolean;
  statusStats?: Record<string, number>;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", ok: false };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", ok: false };
  }

  const parsed = GetAdminStatsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.message,
      ok: false,
    };
  }

  try {
    const statusStats = await adminDal.getTransactionStatusStats();
    return { ok: true, statusStats };
  } catch (error) {
    try {
      const { error: logError } = await import("@/lib/logger");
      logError(
        "admin-stats.getTransactionStatusStats",
        "Failed to get transaction status stats",
        {
          message: String((error as any)?.message ?? error),
          stack: (error as any)?.stack,
        },
      );
    } catch {
      /* ignore - already logged above */
    }
    return { error: "Failed to load transaction status statistics", ok: false };
  }
}

/**
 * Get transaction type statistics.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must be an empty object
 * @returns {Promise<{ ok: boolean; typeStats?: Record<string, number>; error?: string }>}
 */
export async function getTransactionTypeStats(input: unknown): Promise<{
  ok: boolean;
  typeStats?: Record<string, number>;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", ok: false };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", ok: false };
  }

  const parsed = GetAdminStatsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.message,
      ok: false,
    };
  }

  try {
    const typeStats = await adminDal.getTransactionTypeStats();
    return { ok: true, typeStats };
  } catch (error) {
    try {
      const { error: logError } = await import("@/lib/logger");
      logError(
        "admin-stats.getTransactionTypeStats",
        "Failed to get transaction type stats",
        {
          message: String((error as any)?.message ?? error),
          stack: (error as any)?.stack,
        },
      );
    } catch {
      /* ignore - already logged above */
    }
    return { error: "Failed to load transaction type statistics", ok: false };
  }
}

/**
 * Get recent transactions for admin dashboard.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy { limit?: number }
 * @returns {Promise<{ ok: boolean; transactions?: AdminTransaction[]; error?: string }>}
 */
export async function getRecentTransactions(
  input: unknown,
): Promise<{ ok: boolean; transactions?: AdminTransaction[]; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", ok: false };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", ok: false };
  }

  const InputSchema = z.object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .meta({ description: "Maximum number of transactions to return" }),
  });

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.message,
      ok: false,
    };
  }

  try {
    const transactions = await adminDal.getRecentTransactions(
      parsed.data.limit,
    );
    return { ok: true, transactions };
  } catch (error) {
    try {
      const { error: logError } = await import("@/lib/logger");
      logError(
        "admin-stats.getRecentTransactions",
        "Failed to get recent transactions",
        {
          message: String((error as any)?.message ?? error),
          stack: (error as any)?.stack,
        },
      );
    } catch {
      /* ignore - already logged above */
    }
    return { error: "Failed to load recent transactions", ok: false };
  }
}

/**
 * Get users with pagination and search.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy { page?: number; pageSize?: number; search?: string }
 * @returns {Promise<{ ok: boolean; users?: PaginatedUsers['users']; pagination?: PaginatedUsers['pagination']; error?: string }>}
 */
export async function getUsers(input: unknown): Promise<{
  ok: boolean;
  users?: PaginatedUsers["users"];
  pagination?: PaginatedUsers["pagination"];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", ok: false };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", ok: false };
  }

  const InputSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
  });

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.message,
      ok: false,
    };
  }

  try {
    const result = await adminDal.getUsersPaginated({
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
      search: parsed.data.search ?? "",
    });
    return { ok: true, pagination: result.pagination, users: result.users };
  } catch (error) {
    try {
      const { error: logError } = await import("@/lib/logger");
      logError("admin-stats.getUsers", "Failed to get users", {
        message: String((error as any)?.message ?? error),
        stack: (error as any)?.stack,
      });
    } catch {
      /* ignore - already logged above */
    }
    return { error: "Failed to load users", ok: false };
  }
}
