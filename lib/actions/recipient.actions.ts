"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Recipient } from "@/types/recipient";

import { auth } from "@/lib/auth";
import { recipientDal } from "@/lib/dal";

/**
 * Description placeholder
 *
 * @type {*}
 */
const RecipientSchema = z.object({
  bankAccountId: z.string().trim().min(1).optional(),
  email: z.string().trim().email(),
  name: z.string().trim().min(1).optional(),
});

/**
 * Description placeholder
 *
 * @type {*}
 */
const RecipientIdSchema = z.object({
  id: z.string().trim().min(1),
});

/**
 * Description placeholder
 *
 * @type {*}
 */
const RecipientUpdateSchema =
  RecipientSchema.partial().merge(RecipientIdSchema);

/** Description placeholder */
const revalidateRecipients = () => {
  revalidatePath("/payment-transfer");
  revalidatePath("/");
};

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<{
 *   ok: boolean;
 *   recipients?: Recipient[];
 *   error?: string;
 * }>}
 */
export async function getRecipients(): Promise<{
  ok: boolean;
  recipients?: Recipient[];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    const recipients = await recipientDal.findByUserId(session.user.id);
    return { ok: true, recipients };
  } catch (error) {
    console.error("Fetching recipients failed:", error);
    return { error: "Failed to load recipients", ok: false };
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   recipient?: Recipient;
 *   error?: string;
 * }>}
 */
export async function createRecipient(input: unknown): Promise<{
  ok: boolean;
  recipient?: Recipient;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = RecipientSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid recipient data", ok: false };
  }

  try {
    const recipient = await recipientDal.createRecipient({
      ...parsed.data,
      userId: session.user.id,
    });
    revalidateRecipients();
    return { ok: true, recipient };
  } catch (error) {
    console.error("Creating recipient failed:", error);
    return { error: "Failed to create recipient", ok: false };
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   recipient?: Recipient;
 *   error?: string;
 * }>}
 */
export async function updateRecipient(input: unknown): Promise<{
  ok: boolean;
  recipient?: Recipient;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = RecipientUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid recipient update", ok: false };
  }

  try {
    const updated = await recipientDal.updateRecipient(parsed.data.id, {
      ...parsed.data,
    });
    revalidateRecipients();
    return { ok: true, recipient: updated[0] };
  } catch (error) {
    console.error("Updating recipient failed:", error);
    return { error: "Failed to update recipient", ok: false };
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   error?: string;
 * }>}
 */
export async function deleteRecipient(input: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = RecipientIdSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid recipient", ok: false };
  }

  try {
    await recipientDal.delete(parsed.data.id);
    revalidateRecipients();
    return { ok: true };
  } catch (error) {
    console.error("Deleting recipient failed:", error);
    return { error: "Failed to delete recipient", ok: false };
  }
}
