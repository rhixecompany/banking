import { Suspense } from "react";

import { HomeServerWrapper } from "@/components/home/home-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Home page route.
 * Wraps HomeServerWrapper in a Suspense boundary as required by Next.js 16
 * for routes that call async auth APIs.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function HomePage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex-center min-h-screen">
          <LoadingSpinner className="size-12" />
        </div>
      }
    >
      <HomeServerWrapper />
    </Suspense>
  );
}
