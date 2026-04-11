"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccess,
  type PlaidLinkOptions,
} from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
import { usePlaid } from "@/components/plaid-context/plaid-context";
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

  // If a PlaidProvider is present higher in the tree, use it instead of
  // initializing Plaid here. This prevents react-plaid-link from injecting
  // the Plaid script multiple times (causes the "embedded more than once"
  // warning and can lead to instability in E2E tests).
  let plaidContext:
    | {
        open: () => void;
        ready: boolean;
        isLoading: boolean;
        error: string | undefined;
      }
    | undefined = undefined;

  try {
    // usePlaid throws when there is no provider in the tree; catch and
    // fallback to local initialization.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    plaidContext = usePlaid();
  } catch {
    // No provider available; continue with local Plaid initialization.
    // Leave plaidContext undefined to trigger local behaviour.
  }

  useEffect(() => {
    // If a PlaidProvider is present, it will handle link token creation and
    // usePlaidLink initialization. We only fetch a link token when no provider
    // exists.
    if (plaidContext) {
      // Mirror provider loading state to keep Button disabled during init.
      setIsLoading(plaidContext.isLoading);
      setError(plaidContext.error);
      return;
    }

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
  }, [userId, plaidContext]);

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

  // If we have a provider, delegate to it to avoid duplicate script injection.
  let open: (() => void) | undefined;
  let ready = false;
  if (plaidContext) {
    open = plaidContext.open;
    ready = plaidContext.ready;
  } else {
    const config: PlaidLinkOptions = {
      onExit: handleExit,
      onSuccess: handleSuccess,
      token: linkToken ?? null,
    };

    // Only call usePlaidLink when there is no provider on the tree.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const plaid = usePlaidLink(config);
    // react-plaid-link's types sometimes expose `open` as a generic Function.
    // Narrow it to the expected `() => void` so TypeScript accepts assignment.
    open = plaid.open as () => void;
    ready = plaid.ready;

    useEffect(() => {
      if (ready && onLoad) {
        onLoad();
      }
    }, [ready, onLoad]);
  }

  const handleClick = () => {
    if (linkToken || plaidContext) {
      open?.();
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
      // When a provider exists, linkToken is managed by the provider so we
      // don't require a local linkToken to enable the button.
      disabled={
        disabled || isLoading || !ready || (!linkToken && !plaidContext)
      }
      onClick={handleClick}
    >
      {isLoading ? "Loading..." : (children ?? "Link Bank Account")}
    </Button>
  );
}

export default PlaidLink;
