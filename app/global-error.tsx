"use client";

import { GlobalErrorClientWrapper } from "@/components/global-error/global-error-client-wrapper";

/**
 * Global error boundary — required to be a Client Component by Next.js.
 * Must render <html> + <body> because it replaces the entire document on error.
 * Delegates content to GlobalErrorClientWrapper.
 *
 * @export
 * @param {{ error: { digest?: string } & Error; reset: () => void }} props
 * @returns {JSX.Element}
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: { digest?: string } & Error;
  reset: () => void;
}): JSX.Element {
  return (
    <html>
      <body>
        <GlobalErrorClientWrapper error={error} reset={reset} />
      </body>
    </html>
  );
}
