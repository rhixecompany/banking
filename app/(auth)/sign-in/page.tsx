import { Suspense } from "react";

import AuthForm from "@/components/AuthForm";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Server component that contains the sign-in page content.
 * Calls getServerSession which is async in Next.js 16.
 * Must be wrapped in Suspense to avoid blocking route errors.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
async function SignInContent(): Promise<JSX.Element> {
  // Dynamic import to avoid circular dependency with SessionProvider
  const { getServerSession } = await import("next-auth");
  const { redirect } = await import("next/navigation");

  const session = await getServerSession();
  if (session) redirect("/dashboard");

  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </section>
  );
}

/**
 * Sign-in page wrapper with Suspense boundary.
 * Required in Next.js 16 to handle async auth APIs without blocking route rendering.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function SignIn(): JSX.Element {
  return (
    <Suspense
      fallback={<LoadingSpinner className="flex-center min-h-screen" />}
    >
      <SignInContent />
    </Suspense>
  );
}
