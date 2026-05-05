"use client";

import { Loader2 } from "lucide-react";

import type { Wallet } from "@/types/wallet";

import { usePlaidSafe } from "@/components/plaid-context/plaid-context";
import { Button } from "@/components/ui/button";

/**
 * Props for PlaidLinkButton component
 * Configures the appearance and behavior of the Plaid Link button
 */
interface PlaidLinkButtonProps {
  /** Button content - defaults to "Link Bank Account" if not provided */
  children?: React.ReactNode;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Callback fired when bank account is successfully linked */
  onSuccess?: (wallet: Wallet) => void;
  /** Button size variant */
  size?: "default" | "icon" | "lg" | "sm";
  /** Button style variant */
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

/**
 * Plaid Link button component
 * Renders a button that opens the Plaid Link modal when clicked
 * Automatically handles loading states and error display
 * Works with or without PlaidProvider in the component tree
 */
export function PlaidLinkButton({
  children,
  className,
  disabled,
  size = "default",
  variant = "default",
}: PlaidLinkButtonProps) {
  // Use the safe variant so this component can render even when the
  // PlaidProvider is not mounted (tests sometimes render components
  // out of the full app layout). Provide sensible fallbacks to avoid
  // throwing while preserving the provider-backed behavior.
  const plaid = usePlaidSafe();

  const error = plaid?.error;
  // Default to not loading so buttons render their intended labels in
  // test environments where the provider may not mount. This avoids
  // hiding the add/connect text behind a loading state and makes the
  // E2E selector more stable.
  const isLoading = plaid?.isLoading ?? false;
  const open = plaid?.open ?? (() => undefined);
  const ready = plaid?.ready ?? false;

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <Button
      className={className}
      disabled={disabled ?? (isLoading || !ready)}
      onClick={open}
      size={size}
      variant={variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading...
        </>
      ) : (
        (children ?? "Link Bank Account")
      )}
    </Button>
  );
}
