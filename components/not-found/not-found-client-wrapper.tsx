"use client";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Client wrapper for the 404 Not Found page.
 * Renders the 404 UI — no interactive state needed,
 * kept as a client boundary for consistency with the wrapper pattern.
 *
 * @export
 * @returns {JSX.Element}
 */
export function NotFoundClientWrapper(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <HomeIcon className="mr-2 size-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
