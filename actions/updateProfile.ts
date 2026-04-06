"use server";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";
import { auth } from "@/lib/auth";

/**
 * Input schema for updating a user profile.
 * `userId` is intentionally omitted — it is resolved from the session.
 */
const UpdateProfileSchema = z.object({
  address: z.string().trim().optional().meta({ description: "Street address" }),
  city: z.string().trim().optional().meta({ description: "City" }),
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .meta({ description: "Email address" }),
  image: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Profile image URL" }),
  name: z.string().trim().min(2).optional().meta({ description: "Full name" }),
  newPassword: z
    .string()
    .trim()
    .min(8)
    .optional()
    .meta({ description: "New password" }),
  password: z
    .string()
    .trim()
    .min(8)
    .optional()
    .meta({ description: "Current password" }),
  phone: z.string().trim().optional().meta({ description: "Phone number" }),
  postalCode: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Postal/ZIP code" }),
  state: z.string().trim().optional().meta({ description: "State" }),
});

/**
 * Inferred type for profile update input (excludes userId — resolved from session).
 *
 * @export
 * @typedef {UpdateProfileInput}
 */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Updates the authenticated user's profile fields.
 * The userId is taken exclusively from the active session — never from client input.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function updateProfile(
  input: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  const userId = session.user.id;

  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }
  const {
    address,
    city,
    email,
    image,
    name,
    newPassword,
    password,
    phone,
    postalCode,
    state,
  } = parsed.data;
  try {
    if (newPassword || email) {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return { error: "User not found", ok: false };
      if (
        !password ||
        !user.password ||
        !(await compare(password, user.password))
      ) {
        return { error: "Current password is incorrect", ok: false };
      }
    }
    const userUpdate: Record<string, unknown> = {};
    if (email) userUpdate.email = email;
    if (name) userUpdate.name = name;
    if (image) userUpdate.image = image;
    if (newPassword) userUpdate.password = await hash(newPassword, 12);
    if (Object.keys(userUpdate).length > 0) {
      await db.update(users).set(userUpdate).where(eq(users.id, userId));
    }
    const profileUpdate: Record<string, unknown> = {};
    if (address) profileUpdate.address = address;
    if (city) profileUpdate.city = city;
    if (state) profileUpdate.state = state;
    if (postalCode) profileUpdate.postalCode = postalCode;
    if (phone) profileUpdate.phone = phone;
    if (Object.keys(profileUpdate).length > 0) {
      await db
        .update(user_profiles)
        .set(profileUpdate)
        .where(eq(user_profiles.userId, userId));
    }
    return { ok: true };
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "23505"
    ) {
      return { error: "Email already registered", ok: false };
    }
    return { error: "Profile update failed", ok: false };
  }
}
