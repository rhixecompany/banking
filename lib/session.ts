import type { Session } from "next-auth";

import { auth } from "./auth";

/**
 * Returns the current user session (or null) in server components/layouts.
 * Keeps code small and re-usable so layouts do not import NextAuth directly.
 */
export async function getCurrentUser(): Promise<undefined | Session["user"]> {
  const session = await auth();
  return session?.user ?? undefined;
}

export default getCurrentUser;
