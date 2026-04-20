// Provenance: inspected dal/user.dal.ts, lib/auth-options.ts, AGENTS.md — server action: validate credentials (no NextAuth session). Draft only.
"use server";
import { findByEmail } from "@/dal/user.dal";
import bcrypt from "bcrypt";
import * as z from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Validates credentials against the user record. Returns { ok, error? }
 * Note: This action intentionally DOES NOT create a session. The NextAuth
 * credentials provider will call this via `authorize()` during sign-in.
 */
export default async function signin(payload: unknown) {
  const parsed = SignInSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const { email, password } = parsed.data;

  const user = await findByEmail(email);
  if (!user) return { ok: false, error: "Invalid credentials" };
  if (!user.isActive) return { ok: false, error: "Account disabled" };

  const ok = await bcrypt.compare(password, (user as any).password ?? "");
  if (!ok) return { ok: false, error: "Invalid credentials" };

  return { ok: true };
}
