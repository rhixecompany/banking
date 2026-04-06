"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Wallet } from "@/types/wallet";

import { walletsDal } from "@/dal";
import { auth } from "@/lib/auth";

/**
 * Schema for validating wallet disconnection input
 */
const DisconnectWalletSchema = z.object({
  walletId: z
    .string()
    .trim()
    .uuid("Invalid wallet ID format")
    .meta({ description: "Wallet ID to disconnect" }),
});

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
  const parsed = DisconnectWalletSchema.safeParse({ walletId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
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
  } catch {
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
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const userId = session.user.id;
  const wallets = await walletsDal.findByUserId(userId);
  return { ok: true, wallets };
}
