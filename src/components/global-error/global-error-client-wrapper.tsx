"use client";

/**
 * Global error boundary client wrapper for Next.js app-wide error handling.
 *
 * @description
 * This component renders when an unhandled error occurs anywhere in the app.
 * It displays a user-friendly error message and provides a reset button to
 * attempt recovery. Used in Next.js global-error.tsx file to catch and
 * display application-level errors.
 *
 * @param props - Component props
 * @param props.error - The error object that was thrown
 * @param props.reset - Function to reset the error boundary and retry
 * @returns Rendered error UI with retry functionality
 */
export default function GlobalErrorClientWrapper({
  error,
  reset,
}: {
  error: { digest?: string } & Error;
  reset: () => void;
}): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
