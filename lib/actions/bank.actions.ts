"use server";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function disconnectBank(bankId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  try {
    await bankDal.delete(bankId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Disconnect bank error:", error);
    return { ok: false, error: "Failed to disconnect bank" };
  }
}

export async function getUserBanks() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  const userId = session.user.id;
  const banks = await bankDal.findByUserId(userId);
  return { ok: true, banks };
}
