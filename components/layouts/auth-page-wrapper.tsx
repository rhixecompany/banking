import { redirect } from "next/navigation";
import type { JSX } from "react";

import AuthForm from "@/components/layouts/auth-form";
import { auth } from "@/lib/auth";

export type AuthFormType = "sign-in" | "sign-up";

interface AuthPageWrapperProps {
  type: AuthFormType;
  /**
   * API endpoint for the authentication form.
   * - "sign-in" → /api/auth/local-validate
   * - "sign-up" → /api/auth/local-create
   */
  actionEndpoint: "/api/auth/local-validate" | "/api/auth/local-create";
}

/**
 * Shared server wrapper for auth pages (sign-in / sign-up).
 * Checks for existing session and redirects to dashboard if authenticated.
 * Renders the AuthForm for unauthenticated visitors.
 *
 * @export
 * @async
 * @param {AuthPageWrapperProps} props
 * @param {AuthFormType} props.type - Form type ("sign-in" or "sign-up")
 * @param {string} props.actionEndpoint - API endpoint to submit the form
 * @returns {Promise<JSX.Element>}
 */
export async function AuthPageWrapper({
  type,
  actionEndpoint,
}: AuthPageWrapperProps): Promise<JSX.Element> {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type={type} actionEndpoint={actionEndpoint} />
    </section>
  );
}
