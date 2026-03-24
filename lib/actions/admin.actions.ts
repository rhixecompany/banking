"use server";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function toggleAdmin(userId: number, makeAdmin: boolean) {
  try {
    await db
      .update(users)
      .set({ isAdmin: makeAdmin })
      .where(eq(users.id, userId));
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update admin status" };
  }
}

export async function setActive(userId: number, isActive: boolean) {
  try {
    await db.update(users).set({ isActive }).where(eq(users.id, userId));
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update active status" };
  }
}
