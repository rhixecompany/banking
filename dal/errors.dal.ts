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
    path?: string | null;
    severity?: string | null;
    stack?: string | null;
    userId?: string | null;
  }) {
    const insertData = {
      message: data.message,
      path: data.path ?? null,
      severity: data.severity ?? "error",
      stack: data.stack ?? null,
      userId: data.userId ?? null,
      createdAt: new Date(),
    } as typeof errors.$inferInsert;

    const [row] = await db.insert(errors).values(insertData).returning();
    return row;
  }
}

export const errorsDal = new ErrorsDal();
