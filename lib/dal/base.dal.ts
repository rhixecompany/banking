import { eq } from "drizzle-orm";

import { db } from "@/database/db";

/**
 * Description placeholder
 *
 * @export
 * @param {*} table
 * @param {string} id
 * @returns {Promise<unknown>}
 */
export function findById(table: any, id: string): Promise<unknown> {
  return db.select().from(table).where(eq(table.id, id));
}

/**
 * Description placeholder
 *
 * @export
 * @param {*} table
 * @param {number} [limitVal=100]
 * @param {number} [offsetVal=0]
 * @returns {Promise<unknown>}
 */
export function findAll(
  table: any,
  limitVal = 100,
  offsetVal = 0,
): Promise<unknown> {
  return db.select().from(table).limit(limitVal).offset(offsetVal);
}

/**
 * Description placeholder
 *
 * @export
 * @param {*} table
 * @param {string} id
 * @returns {Promise<unknown>}
 */
export function deleteById(table: any, id: string): Promise<unknown> {
  return db.delete(table).where(eq(table.id, id));
}
