"use server";

import type { UserWithProfile } from "@/types/user";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<{
 *   name?: string;
 *   email?: string;
 * } | null>}
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
 * Logs out the current user by clearing the server-side session.
 * The client is responsible for calling signOut() from next-auth/react.
 *
 * @export
 * @async
 * @returns {Promise<boolean>} True if logout was successful
 */
export async function logoutAccount(): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
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
