"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccess,
  type PlaidLinkOptions,
} from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
import { usePlaidSafe } from "@/components/plaid-context/plaid-context";
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

  // Prefer the safe hook variant which won't throw if no provider exists.
  // This hook is safe to call here because it does not use other hooks.

  plaidContext = usePlaidSafe();

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

  // Render path: if a PlaidProvider exists, render a provider-backed button
  // that delegates open/ready state. Otherwise render a local button that
  // initializes usePlaidLink. Splitting into two components keeps hook usage
  // consistent inside each component and avoids conditional hooks in the
  // same function.
  if (plaidContext) {
    const handleClick = () => {
      // Provider manages token/open; just delegate.
      plaidContext.open();
    };

    if (error) {
      return <div className="text-sm text-destructive">{error}</div>;
    }

    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isLoading || !plaidContext.ready}
        onClick={handleClick}
      >
        {isLoading ? "Loading..." : (children ?? "Link Bank Account")}
      </Button>
    );
  }

  // LocalPlaidButton is a separate component that always calls hooks used to
  // initialize Plaid Link. Keeping it as a nested component ensures hooks are
  // used in a consistent order for that component.
  function LocalPlaidButton() {
    const config: PlaidLinkOptions = {
      onExit: handleExit,
      onSuccess: handleSuccess,
      token: linkToken ?? null,
    };

    const plaid = usePlaidLink(config);
    const openLocal = plaid.open as () => void;
    const readyLocal = plaid.ready;

    useEffect(() => {
      if (readyLocal && onLoad) {
        // onLoad is a stable callback provided by the caller; call it when
        // the Plaid link is ready. We intentionally do not include onLoad in
        // the dependency array to avoid re-running this effect if the parent
        // provides a new callback reference.
        onLoad();
      }
    }, [readyLocal]);

    const handleClickLocal = () => {
      if (linkToken) openLocal();
    };

    if (error) {
      return <div className="text-sm text-destructive">{error}</div>;
    }

    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled || isLoading || !readyLocal || !linkToken}
        onClick={handleClickLocal}
      >
        {isLoading ? "Loading..." : (children ?? "Link Bank Account")}
      </Button>
    );
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  return <LocalPlaidButton />;
}

export default PlaidLink;
