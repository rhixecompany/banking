"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccess,
  type PlaidLinkOptions,
} from "react-plaid-link";

import type { Bank } from "@/types/bank";

import { Button } from "@/components/ui/button";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/plaid.actions";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface PlaidLinkProps
 * @typedef {PlaidLinkProps}
 */
export interface PlaidLinkProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {string}
   */
  userId: string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?(bank: Bank) => void}
   */
  onSuccess?: (bank: Bank) => void;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?() => void}
   */
  onExit?: () => void;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?() => void}
   */
  onLoad?: () => void;
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
   * @type {?React.ReactNode}
   */
  children?: React.ReactNode;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {PlaidLinkProps} param0
 * @param {React.ReactNode} param0.children
 * @param {string} param0.className
 * @param {boolean} param0.disabled
 * @param {() => void} param0.onExit
 * @param {() => void} param0.onLoad
 * @param {(bank: Bank) => void} param0.onSuccess
 * @param {("default" | "icon" | "lg" | "sm")} [param0.size="default"]
 * @param {string} param0.userId
 * @param {("default" | "destructive" | "ghost" | "link" | "outline" | "secondary")} [param0.variant="default"]
 * @returns {ReactJSX.Element}
 */
export function PlaidLink({
  children,
  className,
  disabled,
  onExit,
  onLoad,
  onSuccess,
  size = "default",
  userId,
  variant = "default",
}: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchLinkToken() {
      setIsLoading(true);
      setError(undefined);

      const result = await createLinkToken({ userId });

      if (result.ok && result.linkToken) {
        setLinkToken(result.linkToken);
      } else {
        setError(result.error ?? "Failed to initialize Plaid Link");
      }

      setIsLoading(false);
    }

    void fetchLinkToken();
  }, [userId]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, _metadata) => {
      const result = await exchangePublicToken({
        publicToken,
        userId,
      });

      if (result.ok && result.bank) {
        onSuccess?.(result.bank);
      } else {
        setError(result.error ?? "Failed to link bank account");
      }
    },
    [userId, onSuccess],
  );

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const config: PlaidLinkOptions = {
    onExit: handleExit,
    onSuccess: handleSuccess,
    token: linkToken ?? null,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (ready && onLoad) {
      onLoad();
    }
  }, [ready, onLoad]);

  const handleClick = () => {
    if (linkToken) {
      open();
    }
  };

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading || !ready || !linkToken}
      onClick={handleClick}
    >
      {isLoading ? "Loading..." : (children ?? "Link Bank Account")}
    </Button>
  );
}

export default PlaidLink;
