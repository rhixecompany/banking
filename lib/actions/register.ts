"use server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { userDal } from "@/lib/dal";

/**
 * Description placeholder
 *
 * @type {*}
 */
const RegisterSchema = z.object({
  address1: z.string().trim().optional(),
  city: z.string().trim().optional(),
  confirmPassword: z.string().trim().optional(),
  dateOfBirth: z.string().trim().optional(),
  email: z.string().trim().email(),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  password: z.string().trim().min(8),
  postalCode: z.string().trim().optional(),
  ssn: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

/**
 * Description placeholder
 *
 * @export
 * @typedef {RegisterInput}
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {unknown}
 */
export async function registerUser(
  input: unknown,
): Promise<{ ok: boolean; user?: unknown; error?: string }> {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }
  const { address1, email, firstName, lastName, password } = parsed.data;

  const existing = await userDal.findByEmail(email);
  if (existing) {
    return { error: "Email already registered", ok: false };
  }

  const hashed = await hash(password, 12);
  try {
    const user = await userDal.createWithProfile({
      email,
      name: `${firstName} ${lastName}`,
      password: hashed,
      profile: { address: address1 },
    });
    return { ok: true, user };
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "23505"
    ) {
      return { error: "Email already registered", ok: false };
    }
    return { error: "Registration failed", ok: false };
  }
}

export { registerUser as register };
