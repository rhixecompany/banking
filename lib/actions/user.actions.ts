"use server";

import { auth } from "@/lib/auth";

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
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<boolean>}
 */
export async function logoutAccount(): Promise<boolean> {
  return true;
}
