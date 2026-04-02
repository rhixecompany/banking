"use client";

import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: { digest?: string } & Error;
  reset: () => void;
}

export default function TransactionHistoryError({
  error: _error,
  reset,
}: ErrorPageProps): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircleIcon className="size-12 text-destructive" />
      <h2 className="text-xl font-semibold">Failed to load transactions</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading your transaction history. Please try
        again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
