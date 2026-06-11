import type { Metadata } from "next";

import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Not Found (404) page.
 */
export const metadata: Metadata = {
  description: "The page you are looking for does not exist.",
  title: "Page Not Found | Banking",
};

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">This page does not exist.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
