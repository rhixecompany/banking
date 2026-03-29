"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Bank } from "@/types/bank";

import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

/**
 * Schema for validating bank disconnection input
 */
const DisconnectBankSchema = z.object({
  bankId: z.string().trim().uuid("Invalid bank ID format"),
});

/**
 * Disconnect a bank account for the authenticated user.
 * Verifies ownership before deletion to prevent unauthorized access.
 *
 * @export
 * @async
 * @param {string} bankId - The ID of the bank to disconnect
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function disconnectBank(
  bankId: string,
): Promise<{ ok: boolean; error?: string }> {
  // Validate input with Zod
  const parsed = DisconnectBankSchema.safeParse({ bankId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const userId = session.user.id;

  // Verify bank ownership - prevents users from disconnecting other users' banks
  const userBanks = await bankDal.findByUserId(userId);
  const bankExists = userBanks.some((bank) => bank.id === bankId);
  if (!bankExists) {
    return { error: "Bank not found", ok: false };
  }

  try {
    await bankDal.delete(bankId);
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { error: "Failed to disconnect bank", ok: false };
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {unknown}
 */
export async function getUserBanks(): Promise<{
  ok: boolean;
  banks?: Bank[];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const userId = session.user.id;
  const banks = await bankDal.findByUserId(userId);
  return { banks, ok: true };
}
