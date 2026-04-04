"use server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

/**
 * Input schema for toggling a user's admin status.
 */
const ToggleAdminSchema = z.object({
  makeAdmin: z.boolean(),
  userId: z.string().trim().min(1),
});

/**
 * Input schema for toggling a user's active status.
 */
const SetActiveSchema = z.object({
  isActive: z.boolean(),
  userId: z.string().trim().min(1),
});

/**
 * Toggles the admin flag on a user account.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy { userId: string; makeAdmin: boolean }
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function toggleAdmin(
  input: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", ok: false };
  if (!session.user.isAdmin) return { error: "Forbidden", ok: false };

  const parsed = ToggleAdminSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      ok: false,
    };
  }

  try {
    await userDal.update(parsed.data.userId, {
      isAdmin: parsed.data.makeAdmin,
    });
    return { ok: true };
  } catch {
    return { error: "Failed to update admin status", ok: false };
  }
}

/**
 * Sets the active/inactive status of a user account.
 * Requires an authenticated admin session.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy { userId: string; isActive: boolean }
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function setActive(
  input: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized", ok: false };
  if (!session.user.isAdmin) return { error: "Forbidden", ok: false };

  const parsed = SetActiveSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      ok: false,
    };
  }

  try {
    await userDal.update(parsed.data.userId, {
      isActive: parsed.data.isActive,
    });
    return { ok: true };
  } catch {
    return { error: "Failed to update active status", ok: false };
  }
}
