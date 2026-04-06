"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * SessionProvider wrapper component for NextAuth.
 * Must be a client component to use SessionProvider.
 *
 * @export
 * @param {Readonly<{ children: React.ReactNode }>} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function SessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
