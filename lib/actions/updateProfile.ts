"use server";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";

/**
 * Description placeholder
 *
 * @type {*}
 */
const UpdateProfileSchema = z.object({
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  image: z.string().trim().optional(),
  name: z.string().trim().min(2).optional(),
  newPassword: z.string().trim().min(8).optional(),
  password: z.string().trim().min(8).optional(),
  phone: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  state: z.string().trim().optional(),
  userId: z.string().trim(),
});

/**
 * Description placeholder
 *
 * @export
 * @typedef {UpdateProfileInput}
 */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {unknown}
 */
export async function updateProfile(
  input: unknown,
): Promise<{ ok: boolean; error?: string }> {
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
    userId,
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
