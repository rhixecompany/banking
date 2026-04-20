import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import PageShell from "./PageShell";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Props}
 */
type Props = { children: React.ReactNode };

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
  if (user) {
    // if user is authenticated, allow
  } else {
    // redirect to sign-in
    redirect("/sign-in");
  }

  return <PageShell>{children}</PageShell>;
}
