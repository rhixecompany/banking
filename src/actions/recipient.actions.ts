"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Recipient } from "@/types/recipient";

import { recipientDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

/**
 * Zod schema for validating recipient creation input.
 */
const RecipientSchema = z.object({
  bankAccountId: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "Associated bank account ID" }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .meta({ description: "Recipient email address" }),
  name: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "Recipient display name" }),
});

/**
 * Zod schema for validating a recipient ID lookup.
 */
const RecipientIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Recipient ID is required")
    .meta({ description: "Recipient record ID" }),
});

/**
 * Zod schema for validating partial recipient update input (requires id).
 */
const RecipientUpdateSchema =
  RecipientSchema.partial().merge(RecipientIdSchema);

/** Revalidates all paths that depend on the recipients list. */
const revalidateRecipients = () => {
  revalidatePath("/payment-transfer");
  revalidatePath("/");
};

/**
 * Returns all saved payment recipients for the authenticated user.
 *
 * @export
 * @async
 * @returns {Promise<{ ok: boolean; recipients?: Recipient[]; error?: string }>}
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
    logger.error("Fetching recipients failed:", error);
    return { error: "Failed to load recipients", ok: false };
  }
}

/**
 * Creates a new payment recipient for the authenticated user.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy RecipientSchema: email, optional name and bankAccountId
 * @returns {Promise<{ ok: boolean; recipient?: Recipient; error?: string }>}
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
    logger.error("Creating recipient failed:", error);
    return { error: "Failed to create recipient", ok: false };
  }
}

/**
 * Updates an existing recipient record for the authenticated user.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy RecipientUpdateSchema: id plus partial recipient fields
 * @returns {Promise<{ ok: boolean; recipient?: Recipient; error?: string }>}
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
    logger.error("Updating recipient failed:", error);
    return { error: "Failed to update recipient", ok: false };
  }
}

/**
 * Deletes a recipient record by ID for the authenticated user.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy RecipientIdSchema: { id: string }
 * @returns {Promise<{ ok: boolean; error?: string }>}
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
    logger.error("Deleting recipient failed:", error);
    return { error: "Failed to delete recipient", ok: false };
  }
}
