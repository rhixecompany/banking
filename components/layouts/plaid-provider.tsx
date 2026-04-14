"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { type PlaidLinkOnSuccess } from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
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
}

/**
 * Canonical PlaidProvider - loads the Plaid script once and exposes a
 * provider-backed initialization path via react-plaid-link.
 */
export function PlaidProvider({
  children,
  onSuccess,
  userId,
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
  }, [userId]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, _metadata) => {
      try {
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
    [userId],
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
