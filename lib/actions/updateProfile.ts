"use server";
import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  userId: z.number(),
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  image: z.string().optional(),
  password: z.string().min(8).optional(),
  newPassword: z.string().min(8).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  ssn: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export async function updateProfile(input: unknown) {
  const parsed = UpdateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const {
    userId,
    email,
    name,
    image,
    password,
    newPassword,
    address,
    city,
    state,
    postalCode,
    phone,
    ssn,
  } = parsed.data;
  try {
    if (newPassword || email) {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return { ok: false, error: "User not found" };
      if (!password || !(await compare(password, user.password))) {
        return { ok: false, error: "Current password is incorrect" };
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
    if (ssn) profileUpdate.ssn = ssn;
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
      return { ok: false, error: "Email already registered" };
    }
    return { ok: false, error: "Profile update failed" };
  }
}
