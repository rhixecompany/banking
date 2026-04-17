"use client";

import { Loader2 } from "lucide-react";

import { usePlaid } from "@/components/plaid-context";
import { Button } from "@/components/ui/button";
import type { Bank } from "@/types/bank";

interface PlaidLinkButtonProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSuccess?: (bank: Bank) => void;
  size?: "default" | "icon" | "lg" | "sm";
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

export function PlaidLinkButton({
  children,
  className,
  disabled,
  size = "default",
  variant = "default",
}: PlaidLinkButtonProps) {
  const { error, isLoading, open, ready } = usePlaid();

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <Button
      className={className}
      disabled={disabled || isLoading || !ready}
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
