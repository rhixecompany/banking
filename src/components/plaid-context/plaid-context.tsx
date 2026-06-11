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
 * Plaid Link context value interface
 * Provides access to Plaid Link functionality and state
 */
export interface PlaidContextValue {
  /** Function to open the Plaid Link modal */
  open: () => void;
  /** Whether Plaid Link is ready to be used */
  ready: boolean;
  /** Whether a bank linking operation is in progress */
  isLoading: boolean;
  /** Error message if bank linking failed */
  error: string | undefined;
}

/**
 * React context for Plaid Link state and functionality
 * Provides access to bank linking capabilities throughout the component tree
 */
export const PlaidContext = createContext<PlaidContextValue | undefined>(
  undefined,
);

/**
 * Hook to access Plaid Link context
 * Throws error if used outside of PlaidProvider
 * @returns Plaid context value with open, ready, isLoading, and error state
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
 * Safe hook variant that returns undefined when no provider is present
 * Use in components that need to operate with or without PlaidProvider
 * @returns Plaid context value or undefined if no provider exists
 */
export function usePlaidSafe(): PlaidContextValue | undefined {
  return useContext(PlaidContext);
}

// Backwards-compatible export: if callers import PlaidProvider from the old
// path, re-export the provider from the new layouts location.
export { default as PlaidProviderCompat } from "@/components/layouts/plaid-provider";

/**
 * Props for PlaidProvider component
 * Configures Plaid Link integration with custom token creation and exchange functions
 */
interface PlaidProviderProps {
  /** User ID for creating Plaid Link tokens */
  userId: string;
  /** Child components that will have access to Plaid context */
  children: React.ReactNode;
  /** Callback fired when bank account is successfully linked */
  onSuccess?: (wallet: Wallet) => void;
  /** Server action to create Plaid Link token */
  createLinkToken?: (input: unknown) => Promise<{
    ok: boolean;
    linkToken?: string;
    error?: string;
  }>;
  /** Server action to exchange public token for access token and create wallet */
  exchangePublicToken?: (input: unknown) => Promise<{
    ok: boolean;
    wallet?: Wallet;
    error?: string;
  }>;
}

/**
 * Plaid Link provider component
 * Manages Plaid Link token creation, modal state, and bank account linking flow
 * Wraps child components with Plaid context for bank connection functionality
 */
export function PlaidProvider({
  children,
  createLinkToken,
  exchangePublicToken,
  onSuccess,
  userId,
}: PlaidProviderProps) {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const onSuccessRef = useRef(onSuccess);
  const tokenFetchedRef = useRef(false);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  // Lazy fetch: only fetch link token when actually needed (when user opens Plaid Link)
  // This avoids expensive API calls on every page load
  const fetchLinkTokenIfNeeded = useCallback(async () => {
    if (tokenFetchedRef.current || !createLinkToken) {
      return;
    }

    tokenFetchedRef.current = true;
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await createLinkToken({ userId });

      if (result.ok && result.linkToken) {
        setLinkToken(result.linkToken);
      } else {
        setError(result.error ?? "Failed to initialize Plaid Link");
        tokenFetchedRef.current = false; // Allow retry on error
      }
    } catch (err) {
      logger.error("PlaidProvider createLinkToken unexpected error:", err);
      setError("Failed to initialize Plaid Link");
      tokenFetchedRef.current = false; // Allow retry on error
    }

    setIsLoading(false);
  }, [createLinkToken, userId]);

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

  const handleOpen = useCallback(async () => {
    // Fetch token lazily when user actually tries to open Plaid Link
    await fetchLinkTokenIfNeeded();
    if (ready && linkToken) {
      open();
    }
  }, [open, ready, linkToken, fetchLinkTokenIfNeeded]);

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
