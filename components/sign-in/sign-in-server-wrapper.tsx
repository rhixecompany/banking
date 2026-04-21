import { redirect } from "next/navigation";

import AuthForm from "@/components/layouts/auth-form";
/**
 * Server wrapper for the sign-in page.
 * Checks if the user already has a session and redirects to the dashboard if so.
 * Renders the sign-in AuthForm for unauthenticated visitors.
 *
 * @export
 * @returns {JSX.Element}
 */
import { auth } from "@/lib/auth";

export async function SignInServerWrapper(): Promise<JSX.Element> {
  // Ensure authenticated users are redirected to dashboard
  // This keeps server-side redirect behavior consistent with SignUpServerWrapper
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  // For sign-in, we intentionally keep this wrapper minimal and delegate
  // authentication to the client AuthForm which uses the credentials
  // flow via /api/auth/local-validate -> actions/auth.signin.ts.
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
}
