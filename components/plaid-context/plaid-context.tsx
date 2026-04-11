"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePlaidLink, type PlaidLinkOnSuccess } from "react-plaid-link";

import type { Wallet } from "@/types/wallet";

import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface PlaidContextValue
 * @typedef {PlaidContextValue}
 */
interface PlaidContextValue {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {() => void}
   */
  open: () => void;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {boolean}
   */
  ready: boolean;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {boolean}
   */
  isLoading: boolean;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {(string | undefined)}
   */
  error: string | undefined;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const PlaidContext = createContext<PlaidContextValue | undefined>(undefined);

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @returns {*}
 */
export function usePlaid() {
  const context = useContext(PlaidContext);
  if (!context) {
    throw new Error("usePlaid must be used within PlaidProvider");
  }
  return context;
}

// Safe hook variant that returns undefined when no provider is present.
// Use this in components that need to operate both with and without a
// PlaidProvider higher in the tree.
export function usePlaidSafe(): PlaidContextValue | undefined {
  return useContext(PlaidContext);
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface PlaidProviderProps
 * @typedef {PlaidProviderProps}
 */
interface PlaidProviderProps {
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
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?(wallet: Wallet) => void}
   */
  onSuccess?: (wallet: Wallet) => void;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {PlaidProviderProps} param0
 * @param {React.ReactNode} param0.children
 * @param {(wallet: Wallet) => void} param0.onSuccess
 * @param {string} param0.userId
 * @returns {ReactJSX.Element}
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
  });

  useEffect(() => {
    async function fetchLinkToken() {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await createLinkToken({ userId });

        if (result.ok && result.linkToken) {
          setLinkToken(result.linkToken);
        } else {
          setError(result.error ?? "Failed to initialize Plaid Link");
        }
      } catch (err) {
        // Defensive: catch any unexpected errors from createLinkToken to avoid
        // uncaught exceptions bubbling to the dev server during Playwright runs.
        logger.error("PlaidProvider createLinkToken unexpected error:", err);
        setError("Failed to initialize Plaid Link");
      }

      setIsLoading(false);
    }

    void fetchLinkToken();
  }, [userId]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken) => {
      const result = await exchangePublicToken({
        publicToken,
        userId,
      });

      if (result.ok && result.wallet) {
        onSuccessRef.current?.(result.wallet);
      } else {
        setError(result.error ?? "Failed to link bank account");
      }
    },
    [userId],
  );

  const { open, ready } = usePlaidLink({
    onSuccess: handleSuccess,
    token: linkToken ?? null,
  });

  const handleOpen = useCallback(() => {
    if (ready && linkToken) {
      open();
    }
  }, [open, ready, linkToken]);

  const value: PlaidContextValue = {
    error,
    isLoading,
    open: handleOpen,
    ready,
  };

  return (
    <>
      {/* Ensure the Plaid Link script is loaded exactly once on pages that use Plaid */}
      <Script
        id="plaid-link-script"
        src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        strategy="afterInteractive"
        onLoad={() => {
          // set a runtime guard so non-Script consumers can check for script presence
          (window as any).__plaid_link_script_loaded = true;
        }}
      />
      <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>
    </>
  );
}
