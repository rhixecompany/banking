"use client";

import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Props for GlobalErrorClientWrapper.
 *
 * @interface GlobalErrorClientWrapperProps
 */
interface GlobalErrorClientWrapperProps {
  /** The error that was caught by the global error boundary. */
  error: { digest?: string } & Error;
  /** Resets the error boundary and re-renders the subtree. */
  reset: () => void;
}

/**
 * Client wrapper for the global error boundary.
 * Renders a user-friendly fallback UI with a retry button.
 *
 * Fixes from the original global-error.tsx:
 * - Adds the missing `reset` prop
 * - Replaces `<NextError statusCode={0} />` with proper fallback UI
 * - Removes placeholder JSDoc
 *
 * @export
 * @param {GlobalErrorClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function GlobalErrorClientWrapper({
  error: _error,
  reset,
}: GlobalErrorClientWrapperProps): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <AlertCircleIcon className="size-12 text-destructive" />
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. Please try again, or contact support if
        the problem persists.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
