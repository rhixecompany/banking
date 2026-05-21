import type { Metadata } from "next";

import { Suspense } from "react";

import AuthLayoutWrapper from "@/components/layouts/AuthLayoutWrapper";
import { SignUpServerWrapper } from "@/components/sign-up/sign-up-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Create a new Horizon Banking account.",
  title: "Sign Up | Horizon Banking",
};

/**
 * Sign-up page route.
 * Wraps SignUpServerWrapper in a Suspense boundary as required by Next.js 16
 * for routes that call async auth APIs.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function SignUp(): JSX.Element {
  return (
    <AuthLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <SignUpServerWrapper />
      </Suspense>
    </AuthLayoutWrapper>
  );
}
