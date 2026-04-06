"use client";

import { Loader2 } from "lucide-react";

import type { Wallet } from "@/types/wallet";

import { usePlaid } from "@/components/plaid-context/plaid-context";
import { Button } from "@/components/ui/button";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface PlaidLinkButtonProps
 * @typedef {PlaidLinkButtonProps}
 */
interface PlaidLinkButtonProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?React.ReactNode}
   */
  children?: React.ReactNode;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?string}
   */
  className?: string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?boolean}
   */
  disabled?: boolean;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?(wallet: Wallet) => void}
   */
  onSuccess?: (wallet: Wallet) => void;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?("default" | "icon" | "lg" | "sm")}
   */
  size?: "default" | "icon" | "lg" | "sm";
  /**
   * Description placeholder
   * @author [object Object]
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
 * @author [object Object]
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
