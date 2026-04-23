import type { JSX } from "react";

import { AuthPageWrapper } from "@/components/layouts/auth-page-wrapper";

/**
 * Server wrapper for the sign-in page.
 * Checks if the user already has a session and redirects to the dashboard if so.
 * Renders the sign-in AuthForm for unauthenticated visitors.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function SignInServerWrapper(): Promise<JSX.Element> {
  return (
    <AuthPageWrapper type="sign-in" actionEndpoint="/api/auth/local-validate" />
  );
}
