"use client";

import { Button } from "@/components/ui/button";

/**
 * Global error boundary — required to be a Client Component by Next.js.
 * Must render <html> + <body> because it replaces the entire document on error.
 */
export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: { digest?: string } & Error;
  reset: () => void;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
