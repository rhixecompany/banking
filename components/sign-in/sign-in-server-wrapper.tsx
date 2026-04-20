import AuthForm from "@/components/layouts/auth-form";

/**
 * Server wrapper for the sign-in page.
 * Checks if the user already has a session and redirects to the dashboard if so.
 * Renders the sign-in AuthForm for unauthenticated visitors.
 *
 * @export
 * @returns {JSX.Element}
 */
export function SignInServerWrapper(): JSX.Element {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
}
