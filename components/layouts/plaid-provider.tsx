"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { type PlaidLinkOnSuccess } from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface PlaidProviderProps
 * @typedef {PlaidProviderProps}
 */
interface PlaidProviderProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  userId: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(wallet: Wallet) => void}
   */
  onSuccess?: (wallet: Wallet) => void;
  /**
   * Server action to create a Plaid link token. Passed from a server
   * component to avoid importing server actions directly in client code.
   */
  createLinkToken?: (input: unknown) => Promise<{
    ok: boolean;
    linkToken?: string;
    error?: string;
  }>;
  /**
   * Server action to exchange a Plaid public token. Passed from a server
   * component to avoid importing server actions directly in client code.
   */
  exchangePublicToken?: (input: unknown) => Promise<{
    ok: boolean;
    wallet?: Wallet;
    error?: string;
  }>;
}

/**
 * Canonical PlaidProvider - loads the Plaid script once and exposes a
 * provider-backed initialization path via react-plaid-link.
 */
export function PlaidProvider({
  children,
  onSuccess,
  userId,
  createLinkToken,
  exchangePublicToken,
}: PlaidProviderProps) {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    async function fetchLinkToken() {
      setIsLoading(true);
      setError(undefined);
      try {
        if (!createLinkToken) {
          setError("Plaid is not configured");
          setIsLoading(false);
          return;
        }
        const result = await createLinkToken({ userId });
        if (result.ok && result.linkToken) setLinkToken(result.linkToken);
        else setError(result.error ?? "Failed to initialize Plaid Link");
      } catch (err) {
        logger.error("PlaidProvider createLinkToken unexpected error:", err);
        setError("Failed to initialize Plaid Link");
      }
      setIsLoading(false);
    }

    void fetchLinkToken();
  }, [userId, createLinkToken]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, _metadata) => {
      try {
        if (!exchangePublicToken) {
          setError("Plaid is not configured");
          return;
        }
        const result = await exchangePublicToken({ publicToken, userId });
        if (result.ok && result.wallet) onSuccessRef.current?.(result.wallet);
        else setError(result.error ?? "Failed to link bank account");
      } catch (err) {
        logger.error(
          "PlaidProvider exchangePublicToken unexpected error:",
          err,
        );
        setError("Failed to link bank account");
      }
    },
    [userId, exchangePublicToken],
  );

  // Provide the react-plaid-link hook here so children can use a safe hook
  // that consumes the provider's token via context in the future.
  // TODO: expose context in later iteration; for now keep Script loader.

  return (
    <>
      <Script
        id="plaid-link-script"
        src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            (window as any).__plaid_link_script_loaded = true;
          } catch {
            // ignore
          }
        }}
      />
      {/* Keep the provider simple; we will migrate consumers to use this file */}
      {children}
    </>
  );
}

export default PlaidProvider;
