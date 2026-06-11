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
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {React.ReactNode}
   */
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
  const user = await getCurrentUser();

  // Auth pages (/sign-in, /sign-up) must be reachable when unauthenticated.
  // If a user already has a session, redirect them to the app.
  if (user) redirect("/dashboard");

  return <PageShell>{children}</PageShell>;
}
