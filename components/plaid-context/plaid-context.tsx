"use client";
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

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface PlaidContextValue
 * @typedef {PlaidContextValue}
 */
export interface PlaidContextValue {
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
export const PlaidContext = createContext<PlaidContextValue | undefined>(
  undefined,
);

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
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @returns {(PlaidContextValue | undefined)}
 */
export function usePlaidSafe(): PlaidContextValue | undefined {
  return useContext(PlaidContext);
}

// Backwards-compatible export: if callers import PlaidProvider from the old
// path, re-export the provider from the new layouts location.
export { default as PlaidProviderCompat } from "@/components/layouts/plaid-provider";

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
  createLinkToken?: (input: unknown) => Promise<{
    ok: boolean;
    linkToken?: string;
    error?: string;
  }>;
  exchangePublicToken?: (input: unknown) => Promise<{
    ok: boolean;
    wallet?: Wallet;
    error?: string;
  }>;
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
  createLinkToken,
  exchangePublicToken,
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
    // If the global script guard is already set, we still fetch a link token
    // but avoid re-inserting the script elsewhere. The runtime guard is set
    // by the Script loader below when it completes.
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

        if (result.ok && result.linkToken) {
          setLinkToken(result.linkToken);
        } else {
          setError(result.error ?? "Failed to initialize Plaid Link");
        }
      } catch (err) {
        // Defensive: catch unexpected errors to avoid uncaught exceptions.
        logger.error("PlaidProvider createLinkToken unexpected error:", err);
        setError("Failed to initialize Plaid Link");
      }

      setIsLoading(false);
    }

    void fetchLinkToken();
  }, [userId]);

  const handleSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken) => {
      if (!exchangePublicToken) {
        setError("Plaid is not configured");
        return;
      }

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
    [userId, exchangePublicToken],
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
      <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>
    </>
  );
}
