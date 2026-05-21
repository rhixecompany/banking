"use server";
import bcrypt from "bcrypt";
import * as z from "zod";

import { userDal } from "@/dal/user.dal";
import { auth } from "@/lib/auth";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SignInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

/**
 * Validates credentials against the user record. Returns { ok, error? }
 * Note: This action intentionally DOES NOT create a session. The NextAuth
 * credentials provider will call this via `authorize()` during sign-in.
 *
 * @protected Credential verification: validates password, called by NextAuth credentials provider.
 * @export
 * @async
 * @param {unknown} payload - Validated sign-in credentials
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export default async function signin(payload: unknown) {
  await auth();
  const parsed = SignInSchema.safeParse(payload);
  if (!parsed.success) return { error: "Invalid input", ok: false };
  const { email, password } = parsed.data;

  const user = await userDal.findByEmail(email);
  if (!user) return { error: "Invalid credentials", ok: false };
  if (!user.isActive) return { error: "Account disabled", ok: false };

  const ok = await bcrypt.compare(password, user.password ?? "");
  if (!ok) return { error: "Invalid credentials", ok: false };

  return { ok: true };
}
