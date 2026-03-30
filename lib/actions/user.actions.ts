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
 * Logs out the current user by signing out from NextAuth and redirecting to sign-in page.
 *
 * @export
 * @async
 * @returns {Promise<boolean>} True if logout was successful
 */
export async function logoutAccount(): Promise<boolean> {
  const { signOut } = await import("next-auth/react");
  await signOut({ callbackUrl: "/sign-in", redirect: false });
  return true;
}
