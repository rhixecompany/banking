import { redirect } from "next/navigation";
import React from "react";

import { getCurrentUser } from "@/lib/session";

import PageShell from "./PageShell";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Props}
 */
interface Props {
  children: React.ReactNode;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {Props} param0
 * @param {React.ReactNode} param0.children
 * @returns {unknown}
 */
export default async function AuthLayoutWrapper({ children }: Props) {
  // Guard: if the user is not authenticated, redirect to sign-in.
  // getCurrentUser will return null when no session exists.
  const user = await getCurrentUser();
  if (!user) {
    // redirect to sign-in (server-side redirect)
    redirect("/sign-in");
  }

  // Authenticated: render the page shell that provides app chrome and providers.
  return <PageShell>{children}</PageShell>;
}
