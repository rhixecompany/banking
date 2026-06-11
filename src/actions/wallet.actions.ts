"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Wallet } from "@/types/wallet";

import { walletsDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

/**
 * Schema for validating wallet disconnection input
 */
const DisconnectWalletSchema = z
  .object({
    walletId: z
      .string()
      .trim()
      .uuid("Invalid wallet ID format")
      .meta({ description: "Wallet ID to disconnect" }),
  })
  .meta({ description: "Disconnect wallet input" });

/**
 * Disconnect a wallet for the authenticated user.
 * Verifies ownership before deletion to prevent unauthorized access.
 *
 * @export
 * @async
 * @param {string} walletId - The ID of the wallet to disconnect
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function disconnectWallet(
  walletId: string,
): Promise<{ ok: boolean; error?: string }> {
  // Auth first: per repo rules, protected actions must verify auth before
  // parsing/validating input or performing DB operations.
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = DisconnectWalletSchema.safeParse({ walletId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  const userId = session.user.id;

  const userWallets = await walletsDal.findByUserId(userId);
  const walletExists = userWallets.some((wallet) => wallet.id === walletId);
  if (!walletExists) {
    return { error: "Wallet not found", ok: false };
  }

  try {
    await walletsDal.softDelete(walletId);
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    // Log unexpected errors and return a stable error shape
    // so Server Actions don't throw during UI flows.
    logger.error("disconnectWallet error:", err);
    return { error: "Failed to disconnect wallet", ok: false };
  }
}

/**
 * Returns all wallets linked to the currently authenticated user.
 *
 * @export
 * @async
 * @returns {Promise<{ ok: boolean; wallets?: Wallet[]; error?: string }>}
 */
export async function getUserWallets(): Promise<{
  ok: boolean;
  wallets?: Wallet[];
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated", ok: false };
    }

    const userId = session.user.id;
    const wallets = await walletsDal.findByUserId(userId);
    return { ok: true, wallets };
  } catch (error) {
    // Defensive: log the error and return a stable error shape for callers.
    // This ensures SSR and E2E flows do not crash when the DAL or DB has
    // unexpected failures.
    logger.error("getUserWallets error:", error);
    return { error: "Failed to get user wallets", ok: false };
  }
}
