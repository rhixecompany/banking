"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Props for the sign-in error page.
 */
interface ErrorPageProps {
  /** The error that was thrown. */
  error: { digest?: string } & Error;
  /** Function to reset the error boundary and retry. */
  reset: () => void;
}

/**
 * Error boundary for the sign-in page.
 *
 * @export
 * @param {ErrorPageProps} param0
 * @param {() => void} param0.reset
 * @returns {JSX.Element}
 */
export default function SignInError({
  error: _error,
  reset,
}: ErrorPageProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertCircleIcon className="size-12 text-destructive" />
      <h2 className="text-xl font-semibold">Failed to load sign in</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading the sign in page. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/sign-up">Go to sign up</Link>
        </Button>
      </div>
    </div>
  );
}
