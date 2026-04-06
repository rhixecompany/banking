"use server";

import type { UserWithProfile } from "@/types/user";

import { userDal } from "@/dal";
import { db } from "@/database/db";
import { errors } from "@/database/schema";
import { auth } from "@/lib/auth";

/**
 * Returns the name and email of the currently authenticated user from the session.
 * Returns undefined when no session exists.
 *
 * @export
 * @async
 * @returns {Promise<{ name?: string; email?: string } | undefined>}
 */
export async function getLoggedInUser(): Promise<
  | {
      name?: string;
      email?: string;
    }
  | undefined
> {
  const session = await auth();
  if (!session?.user) return undefined;
  return {
    email: session.user.email ?? undefined,
    name: session.user.name ?? undefined,
  };
}

/**
 * Performs pre-logout server-side work: validates the session exists and
 * writes an audit record to the errors table (severity "info").
 * The caller is responsible for invoking signOut() from next-auth/react
 * to clear the JWT cookie on the client.
 *
 * @export
 * @async
 * @returns {Promise<boolean>} True if the session existed and audit log was written
 */
export async function logoutAccount(): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  await db.insert(errors).values({
    message: "User logout",
    path: "/sign-out",
    severity: "info",
    userId: session.user.id,
  });

  return true;
}

/**
 * Returns the full user record with profile for the currently authenticated user.
 *
 * @export
 * @async
 * @returns {Promise<{ ok: boolean; user?: UserWithProfile; error?: string }>}
 */
export async function getUserWithProfile(): Promise<{
  ok: boolean;
  user?: UserWithProfile;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  try {
    const user = await userDal.findByIdWithProfile(session.user.id);
    if (!user) {
      return { error: "User not found", ok: false };
    }
    return { ok: true, user };
  } catch {
    return { error: "Failed to fetch user profile", ok: false };
  }
}
