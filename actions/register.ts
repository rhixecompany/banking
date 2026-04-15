"use server";
import bcrypt from "bcrypt";
import { z } from "zod";

import type { UserWithProfile } from "@/types/user";

import { userDal } from "@/dal";

/**
 * Zod schema for validating new user registration input.
 *
 * @type {*}
 */
const RegisterSchema = z.object({
  address1: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Street address" }),
  city: z.string().trim().optional().meta({ description: "City" }),
  confirmPassword: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Password confirmation" }),
  dateOfBirth: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Date of birth (ISO string)" }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .meta({ description: "Email address" }),
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .meta({ description: "First name" }),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .meta({ description: "Last name" }),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .meta({ description: "Password" }),
  postalCode: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Postal/ZIP code" }),
  ssn: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Social Security Number" }),
  state: z.string().trim().optional().meta({ description: "State" }),
});

/**
 * Inferred TypeScript type from RegisterSchema.
 *
 * @export
 * @typedef {RegisterInput}
 */
export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Registers a new user account, hashing the password and creating a profile row.
 * Returns the created user on success or an error message on failure.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {unknown}
 */
export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: undefined | UserWithProfile;
  error?: string;
}> {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    const allErrors = parsed.error.issues
      .slice(0, 3)
      .map((issue) => issue.message)
      .join("; ");
    return { error: allErrors, ok: false };
  }
  const { address1, email, firstName, lastName, password } = parsed.data;

  const existing = await userDal.findByEmail(email);
  if (existing) {
    return { error: "Email already registered", ok: false };
  }

  const hashed = await bcrypt.hash(password, 12);
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
