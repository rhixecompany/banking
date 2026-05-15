import type { JSX } from "react";

import { AuthPageWrapper } from "@/components/layouts/auth-page-wrapper";

/**
 * Server wrapper for the sign-up page.
 * Checks if the user already has a session and redirects to the dashboard if so.
 * Renders the sign-up AuthForm for unauthenticated visitors.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function SignUpServerWrapper(): Promise<JSX.Element> {
  return (
    <AuthPageWrapper type="sign-up" actionEndpoint="/api/auth/local-create" />
  );
}
