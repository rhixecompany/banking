// Provenance: inspected dal/user.dal.ts — server action: create user with minimal profile. Draft only.
"use server";
import { registerUser } from "@/actions/register";
import { signUpSchema } from "@/lib/validations/auth";

// Delegate to the canonical registerUser server action which centralizes
// registration logic (hashing, duplicate checks, profile creation).
export default async function signup(payload: unknown) {
  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) return { error: "Invalid input", ok: false };

  // registerUser returns the { ok, user?, error? } shape expected by callers
  return registerUser(payload);
}
