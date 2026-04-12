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
      message: data.message,
      createdAt: new Date(),
      path: data.path ?? undefined,
      severity: data.severity ?? "error",
      stack: data.stack ?? undefined,
      userId: data.userId ?? undefined,
    } as typeof errors.$inferInsert;

    const [row] = await db.insert(errors).values(insertData).returning();
    return row;
  }
}

export const errorsDal = new ErrorsDal();
