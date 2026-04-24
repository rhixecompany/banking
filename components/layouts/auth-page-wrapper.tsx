import type { JSX } from "react";

import { redirect } from "next/navigation";

import AuthForm from "@/components/layouts/auth-form";
import { auth } from "@/lib/auth";

export type AuthFormType = "sign-in" | "sign-up";

interface AuthPageWrapperProps {
  /**
   * API endpoint for the authentication form.
   * - "sign-up" → /api/auth/local-create
   * - "sign-in" → /api/auth/local-validate
   */
  actionEndpoint: "/api/auth/local-create" | "/api/auth/local-validate";
  type: AuthFormType;
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
  actionEndpoint,
  type,
}: AuthPageWrapperProps): Promise<JSX.Element> {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type={type} actionEndpoint={actionEndpoint} />
    </section>
  );
}
