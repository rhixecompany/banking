"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccess,
  type PlaidLinkOptions,
} from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
import { Button } from "@/components/ui/button";

/**
 * Props for the PlaidLink component.
 *
 * @export
 * @interface PlaidLinkProps
 */
export interface PlaidLinkProps {
  /** User ID for creating the Plaid link token */
  userId: string;
  /** Callback fired when wallet is successfully linked */
  onSuccess?: (wallet: Wallet) => void;
  /** Callback fired when Plaid Link is closed by user */
  onExit?: () => void;
  /** Callback fired when Plaid Link loads */
  onLoad?: () => void;
  /** Button variant style */
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
  /** Button size */
  size?: "default" | "icon" | "lg" | "sm";
  /** Additional CSS classes */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * PlaidLink wraps the Plaid Link UI for bank account connection.
 * Handles token creation, Plaid Link initialization, and public token exchange.
 *
 * @description
 * Provides a button that opens the Plaid Link flow for connecting bank accounts.
 * Automatically creates a link token, initializes Plaid Link, and exchanges the
 * public token for an access token upon successful connection. Triggers optional
 * callbacks for success, exit, and load events.
 *
 * @see PlaidLinkProps
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

      if (result.ok && result.wallet) {
        onSuccess?.(result.wallet);
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
