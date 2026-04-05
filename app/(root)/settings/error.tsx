"use client";

import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface ErrorPageProps
 * @typedef {ErrorPageProps}
 */
interface ErrorPageProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {({ digest?: string } & Error)}
   */
  error: { digest?: string } & Error;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {() => void}
   */
  reset: () => void;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {ErrorPageProps} param0
 * @param {*} param0.error: _error
 * @param {() => void} param0.reset
 * @returns {JSX.Element}
 */
export default function SettingsError({
  error: _error,
  reset,
}: ErrorPageProps): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircleIcon className="size-12 text-destructive" />
      <h2 className="text-xl font-semibold">Failed to load settings</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading your profile settings. Please try
        again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
