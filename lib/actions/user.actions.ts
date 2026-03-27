"use server";

import { auth } from "@/lib/auth";

export async function getLoggedInUser(): Promise<{
  name?: string;
  email?: string;
} | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    name: session.user.name ?? undefined,
    email: session.user.email ?? undefined,
  };
}

export async function logoutAccount() {
  return true;
}
