import { eq } from "drizzle-orm";

import { db } from "@/database/db";

export function findById(table: any, id: string): Promise<unknown> {
  return db.select().from(table).where(eq(table.id, id));
}

export function findAll(
  table: any,
  limitVal = 100,
  offsetVal = 0,
): Promise<unknown> {
  return db.select().from(table).limit(limitVal).offset(offsetVal);
}

export function deleteById(table: any, id: string): Promise<unknown> {
  return db.delete(table).where(eq(table.id, id));
}
