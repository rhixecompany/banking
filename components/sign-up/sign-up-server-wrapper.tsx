import { redirect } from "next/navigation";

import AuthForm from "@/components/auth-form/auth-form";
import { auth } from "@/lib/auth";

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
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
}
