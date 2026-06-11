import { eq, gte, lt } from "drizzle-orm";

import { errorsDal } from "@/dal";
import { db } from "@/database/db";
import { errors } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {ErrorSeverity}
 */
export type ErrorSeverity = "error" | "info" | "warning";

/**
 * Description placeholder
 *
 * @interface LogErrorParams
 * @typedef {LogErrorParams}
 */
interface LogErrorParams {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  message: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  stack?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  path?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  userId?: string;
  /**
   * Description placeholder
   *
   * @type {?ErrorSeverity}
   */
  severity?: ErrorSeverity;
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {LogErrorParams} param0
 * @param {string} param0.message
 * @param {string} param0.stack
 * @param {string} param0.path
 * @param {string} param0.userId
 * @param {ErrorSeverity} [param0.severity="error"]
 * @returns {*}
 */
export async function logError({
  message,
  path,
  severity = "error",
  stack,
  userId,
}: LogErrorParams): Promise<void> {
  try {
    // Delegate to the Errors DAL to centralize error/audit logging
    await errorsDal.insertError({
      message,
      path,
      severity,
      stack,
      userId,
    });
  } catch {
    // Silently fail - don't crash the app for logging failures
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {number} [limit=100]
 * @returns {unknown}
 */
export async function getErrors(limit = 100): Promise<unknown> {
  return await db.select().from(errors).orderBy(errors.createdAt).limit(limit);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {string} userId
 * @param {number} [limit=50]
 * @returns {unknown}
 */
export async function getErrorsByUser(
  userId: string,
  limit = 50,
): Promise<unknown> {
  return await db
    .select()
    .from(errors)
    .where(eq(errors.userId, userId))
    .orderBy(errors.createdAt)
    .limit(limit);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {number} [hours=24]
 * @param {number} [limit=50]
 * @returns {unknown}
 */
export async function getRecentErrors(
  hours = 24,
  limit = 50,
): Promise<unknown> {
  const since = new Date();
  since.setHours(since.getHours() - hours);

  // Return errors created since the calculated timestamp (>=)
  return await db
    .select()
    .from(errors)
    .where(gte(errors.createdAt, since))
    .orderBy(errors.createdAt)
    .limit(limit);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {number} [days=30]
 * @returns {*}
 */
export async function clearOldErrors(days = 30): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  // Delete records older than cutoff time
  await db.delete(errors).where(lt(errors.createdAt, cutoff));
}

/**
 * Description placeholder
 *
 * @export
 * @param {?string} [userId]
 * @returns {(error: unknown, path?: string) => void}
 */
export function createErrorHandler(
  userId?: string,
): (error: unknown, path?: string) => void {
  return function handleError(error: unknown, path?: string): void {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;

    void logError({
      message,
      path,
      severity: "error",
      stack,
      userId,
    });
  };
}
