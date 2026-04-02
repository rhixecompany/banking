import type { Metadata } from "next";

import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  description: "The page you are looking for does not exist.",
  title: "Page Not Found | Banking",
};

export default function NotFound(): JSX.Element {
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
