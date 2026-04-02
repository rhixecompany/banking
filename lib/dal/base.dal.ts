import type { InferSelectModel } from "drizzle-orm";
import type { AnyPgTable, PgColumn } from "drizzle-orm/pg-core";

import { eq } from "drizzle-orm";

import { db } from "@/database/db";

// Drizzle's db.select().from() has a conditional-type guard (TableLikeHasEmptySelection)
// that TypeScript cannot satisfy with a bare generic `T extends AnyPgTable`.
// The `table as any` casts at the internal call sites are intentional and isolated
// to these three utility functions — all public signatures remain fully typed.
// The @typescript-eslint/no-explicit-any rule is disabled for this file in eslint.config.mts.

/**
 * Finds records matching the given `id` column value.
 *
 * @export
 * @template T - Drizzle PG table type that exposes an `id` column
 * @param {T & { id: PgColumn }} table - The Drizzle table object
 * @param {string} id - The record ID to look up
 * @returns {Promise<InferSelectModel<T>[]>}
 */
export function findById<T extends AnyPgTable>(
  table: T & { id: PgColumn },
  id: string,
): Promise<InferSelectModel<T>[]> {
  return db
    .select()
    .from(table as any)
    .where(eq(table.id, id)) as unknown as Promise<InferSelectModel<T>[]>;
}

/**
 * Returns a paginated list of all records in the table.
 *
 * @export
 * @template T - Drizzle PG table type
 * @param {T} table - The Drizzle table object
 * @param {number} [limitVal=100] - Maximum number of rows to return
 * @param {number} [offsetVal=0] - Number of rows to skip
 * @returns {Promise<InferSelectModel<T>[]>}
 */
export function findAll<T extends AnyPgTable>(
  table: T,
  limitVal = 100,
  offsetVal = 0,
): Promise<InferSelectModel<T>[]> {
  return db
    .select()
    .from(table as any)
    .limit(limitVal)
    .offset(offsetVal) as unknown as Promise<InferSelectModel<T>[]>;
}

/**
 * Deletes a single record by its `id` column.
 *
 * @export
 * @template T - Drizzle PG table type that exposes an `id` column
 * @param {T & { id: PgColumn }} table - The Drizzle table object
 * @param {string} id - The record ID to delete
 * @returns {Promise<void>}
 */
export async function deleteById<T extends AnyPgTable>(
  table: T & { id: PgColumn },
  id: string,
): Promise<void> {
  await db.delete(table as any).where(eq(table.id, id));
}
