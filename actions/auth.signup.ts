"use server";
import { registerUser } from "@/actions/register";
import { signUpSchema } from "@/lib/validations/auth";

// Delegate to the canonical registerUser server action which centralizes
// registration logic (hashing, duplicate checks, profile creation).
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {unknown} payload
 * @returns {unknown}
 */
export default async function signup(payload: unknown) {
  const parsed = signUpSchema.safeParse(payload);
  if (!parsed.success) return { error: "Invalid input", ok: false };

  // registerUser returns the { ok, user?, error? } shape expected by callers
  return registerUser(payload);
}
