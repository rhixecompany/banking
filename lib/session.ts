import type { Session } from "next-auth";
import { auth } from "./auth";

/**
 * Returns the current user session (or null) in server components/layouts.
 * Keeps code small and re-usable so layouts do not import NextAuth directly.
 */
export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await auth();
  return session?.user ?? null;
}

export default getCurrentUser;
