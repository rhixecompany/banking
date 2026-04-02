import type { Metadata } from "next";

import { Suspense } from "react";

import AuthForm from "@/components/AuthForm";
import { LoadingSpinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  description: "Create a new Horizon Banking account.",
  title: "Sign Up | Horizon Banking",
};

/**
 * Server component that contains the sign-up page content.
 * Calls getServerSession which is async in Next.js 16.
 * Must be wrapped in Suspense to avoid blocking route errors.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
async function SignUpContent(): Promise<JSX.Element> {
  // Dynamic import to avoid circular dependency with SessionProvider
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

/**
 * Sign-up page wrapper with Suspense boundary.
 * Required in Next.js 16 to handle async auth APIs without blocking route rendering.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function SignUp(): JSX.Element {
  return (
    <Suspense
      fallback={<LoadingSpinner className="flex-center min-h-screen" />}
    >
      <SignUpContent />
    </Suspense>
  );
}
