"use client";

/**
 * Global error wrapper.
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
