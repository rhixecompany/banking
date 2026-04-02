"use client";

import { Loader2 } from "lucide-react";

import type { Bank } from "@/types/bank";

import { usePlaid } from "@/components/plaid-context";
import { Button } from "@/components/ui/button";

/**
 * Description placeholder
 *
 * @interface PlaidLinkButtonProps
 * @typedef {PlaidLinkButtonProps}
 */
interface PlaidLinkButtonProps {
  /**
   * Description placeholder
   *
   * @type {?React.ReactNode}
   */
  children?: React.ReactNode;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  className?: string;
  /**
   * Description placeholder
   *
   * @type {?boolean}
   */
  disabled?: boolean;
  /**
   * Description placeholder
   *
   * @type {?(bank: Bank) => void}
   */
  onSuccess?: (bank: Bank) => void;
  /**
   * Description placeholder
   *
   * @type {?("default" | "icon" | "lg" | "sm")}
   */
  size?: "default" | "icon" | "lg" | "sm";
  /**
   * Description placeholder
   *
   * @type {?(| "default"
   *     | "destructive"
   *     | "ghost"
   *     | "link"
   *     | "outline"
   *     | "secondary")}
   */
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
}

/**
 * Description placeholder
 *
 * @export
 * @param {PlaidLinkButtonProps} param0
 * @param {React.ReactNode} param0.children
 * @param {string} param0.className
 * @param {boolean} param0.disabled
 * @param {("default" | "icon" | "lg" | "sm")} [param0.size="default"]
 * @param {("default" | "destructive" | "ghost" | "link" | "outline" | "secondary")} [param0.variant="default"]
 * @returns {ReactJSX.Element}
 */
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
      disabled={disabled ?? isLoading ?? !ready}
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
