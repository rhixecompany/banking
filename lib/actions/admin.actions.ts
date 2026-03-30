"use server";
import { eq } from "drizzle-orm";

import { db } from "@/database/db";
import { users } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {string} userId
 * @param {boolean} makeAdmin
 * @returns {unknown}
 */
export async function toggleAdmin(
  userId: string,
  makeAdmin: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db
      .update(users)
      .set({ isAdmin: makeAdmin })
      .where(eq(users.id, userId));
    return { ok: true };
  } catch {
    return { error: "Failed to update admin status", ok: false };
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {string} userId
 * @param {boolean} isActive
 * @returns {unknown}
 */
export async function setActive(
  userId: string,
  isActive: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await db.update(users).set({ isActive }).where(eq(users.id, userId));
    return { ok: true };
  } catch {
    return { error: "Failed to update active status", ok: false };
  }
}
