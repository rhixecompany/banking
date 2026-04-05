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

import type { Bank } from "@/types/bank";

import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/plaid.actions";

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
   * @type {?(bank: Bank) => void}
   */
  onSuccess?: (bank: Bank) => void;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {PlaidProviderProps} param0
 * @param {React.ReactNode} param0.children
 * @param {(bank: Bank) => void} param0.onSuccess
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
    async (publicToken) => {
      const result = await exchangePublicToken({
        publicToken,
        userId,
      });

      if (result.ok && result.bank) {
        onSuccessRef.current?.(result.bank);
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
    <PlaidContext.Provider value={value}>{children}</PlaidContext.Provider>
  );
}
