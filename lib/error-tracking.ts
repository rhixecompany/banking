import { db } from "@/database/db";
import { errors } from "@/database/schema";
import { eq } from "drizzle-orm";

export type ErrorSeverity = "error" | "warning" | "info";

interface LogErrorParams {
  message: string;
  stack?: string;
  path?: string;
  userId?: string;
  severity?: ErrorSeverity;
}

export async function logError({
  message,
  stack,
  path,
  userId,
  severity = "error",
}: LogErrorParams) {
  try {
    await db.insert(errors).values({
      message,
      stack,
      path,
      userId,
      severity,
    });
  } catch (error) {
    console.error("Failed to log error to database:", error);
  }
}

export async function getErrors(limit = 100) {
  return db.select().from(errors).orderBy(errors.createdAt).limit(limit);
}

export async function getErrorsByUser(userId: string, limit = 50) {
  return db
    .select()
    .from(errors)
    .where(eq(errors.userId, userId))
    .orderBy(errors.createdAt)
    .limit(limit);
}

export async function getRecentErrors(hours = 24, limit = 50) {
  const since = new Date();
  since.setHours(since.getHours() - hours);

  return db
    .select()
    .from(errors)
    .where(eq(errors.createdAt, since))
    .orderBy(errors.createdAt)
    .limit(limit);
}

export async function clearOldErrors(days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  await db.delete(errors).where(eq(errors.createdAt, cutoff));
}

export function createErrorHandler(userId?: string) {
  return function handleError(error: unknown, path?: string) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;

    logError({
      message,
      stack,
      path,
      userId,
      severity: "error",
    });
  };
}
