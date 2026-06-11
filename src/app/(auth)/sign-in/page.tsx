import type { Metadata } from "next";

import { Suspense } from "react";

import AuthLayoutWrapper from "@/components/layouts/AuthLayoutWrapper";
import { SignInServerWrapper } from "@/components/sign-in/sign-in-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Sign in to your Horizon Banking account.",
  title: "Sign In | Horizon Banking",
};

/**
 * Sign-in page route.
 * Wraps SignInServerWrapper in a Suspense boundary as required by Next.js 16
 * for routes that call async auth APIs.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function SignIn(): JSX.Element {
  return (
    <AuthLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <SignInServerWrapper />
      </Suspense>
    </AuthLayoutWrapper>
  );
}
