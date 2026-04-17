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

import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/plaid.actions";
import type { Bank } from "@/types/bank";

interface PlaidContextValue {
  open: () => void;
  ready: boolean;
  isLoading: boolean;
  error: string | undefined;
}

const PlaidContext = createContext<PlaidContextValue | null>(null);

export function usePlaid() {
  const context = useContext(PlaidContext);
  if (!context) {
    throw new Error("usePlaid must be used within PlaidProvider");
  }
  return context;
}

interface PlaidProviderProps {
  userId: string;
  children: React.ReactNode;
  onSuccess?: (bank: Bank) => void;
}

export function PlaidProvider({
  children,
  onSuccess,
  userId,
}: PlaidProviderProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
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
    token: linkToken,
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
