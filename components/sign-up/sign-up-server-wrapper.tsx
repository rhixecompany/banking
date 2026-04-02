import AuthForm from "@/components/AuthForm";

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
  // Dynamic imports avoid circular dependency with SessionProvider
  const { getServerSession } = await import("next-auth");
  const { redirect } = await import("next/navigation");

  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
}
