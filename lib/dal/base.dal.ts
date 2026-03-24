/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/database/db";
import { eq } from "drizzle-orm";

export async function findById<T extends { id: unknown }>(
  table: T,
  id: number,
) {
  return db
    .select()
    .from(table as any)
    .where(eq((table as any).id, id));
}

export async function findAll<T>(table: T, limitVal = 100, offsetVal = 0) {
  return db
    .select()
    .from(table as any)
    .limit(limitVal)
    .offset(offsetVal);
}

export async function deleteById<T extends { id: unknown }>(
  table: T,
  id: number,
) {
  return db.delete(table as any).where(eq((table as any).id, id));
}
