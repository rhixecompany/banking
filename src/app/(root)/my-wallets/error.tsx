"use client";

import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Props for the my-wallets error page.
 */
interface ErrorPageProps {
  /** The error that was thrown. */
  error: { digest?: string } & Error;
  /** Function to reset the error boundary and retry. */
  reset: () => void;
}

/**
 * Error boundary for the my-wallets page.
 *
 * @export
 * @param {ErrorPageProps} param0
 * @param {() => void} param0.reset
 * @returns {JSX.Element}
 */
export default function MyWalletsError({
  error: _error,
  reset,
}: ErrorPageProps): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircleIcon className="size-12 text-destructive" />
      <h2 className="text-xl font-semibold">Failed to load wallets</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading your wallet accounts. Please try
        again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
