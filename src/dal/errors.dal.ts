import { gte, lt } from "drizzle-orm";

import { db } from "@/database/db";
import { errors } from "@/database/schema";

/**
 * Data access layer for the `errors` table.
 * Centralizes application error / audit logging so Server Actions don't import db/schema directly.
 */
export class ErrorsDal {
  /**
   * Inserts an error/audit record and returns the created row.
   */
  async insertError(data: {
    message: string;
    path?: string | undefined;
    severity?: string | undefined;
    stack?: string | undefined;
    userId?: string | undefined;
  }) {
    const insertData = {
      createdAt: new Date(),
      message: data.message,
      path: data.path ?? undefined,
      severity: data.severity ?? "error",
      stack: data.stack ?? undefined,
      userId: data.userId ?? undefined,
    } as typeof errors.$inferInsert;

    const [row] = await db.insert(errors).values(insertData).returning();
    return row;
  }

  /**
   * Returns recent errors created within the last `hours` hours (inclusive)
   */
  async getRecentErrors(
    hours = 24,
    limit = 50,
  ): Promise<(typeof errors.$inferSelect)[]> {
    const since = new Date();
    since.setHours(since.getHours() - hours);
    return await db
      .select()
      .from(errors)
      .where(gte(errors.createdAt, since))
      .orderBy(errors.createdAt)
      .limit(limit);
  }

  /**
   * Deletes errors older than `days` days (strictly less than cutoff)
   */
  async clearOldErrors(days = 30): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    await db.delete(errors).where(lt(errors.createdAt, cutoff));
  }
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {ErrorsDal}
 */

export const errorsDal = new ErrorsDal();
