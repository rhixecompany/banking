/**
 * useBankConnection hook — provides bank connection status and Plaid Link control.
 * Wraps the existing PlaidContext/usePlaid with connection state from the server.
 */

import { useCallback, useEffect, useState } from "react";

import { getUserWallets } from "@/actions/wallet.actions";

import type { Wallet } from "@/types/wallet";

import { usePlaid } from "@/components/plaid-context/plaid-context";

/**
 * Hook return type for bank connection status.
 */
export interface UseBankConnectionReturn {
  /** Whether the user has any linked bank accounts. */
  isConnected: boolean;
  /** All linked wallets (bank accounts). */
  wallets: Wallet[];
  /** Number of linked wallets. */
  walletCount: number;
  /** Open the Plaid Link modal to connect a bank account. */
  openPlaidLink: () => void;
  /** Whether Plaid Link is ready to open. */
  isLinkReady: boolean;
  /** Whether Plaid Link is currently loading. */
  isLinkLoading: boolean;
  /** Error message from Plaid Link. */
  linkError: string | undefined;
  /** Refresh bank connection data. */
  refresh: () => Promise<void>;
}

/**
 * Provides bank connection status and Plaid Link control.
 * Combines server-side wallet data with client-side Plaid Link functionality.
 *
 * @example
 * ```tsx
 * const { isConnected, walletCount, openPlaidLink, isLinkReady } = useBankConnection();
 *
 * if (!isConnected) {
 *   return <button onClick={openPlaidLink} disabled={!isLinkReady}>Connect Bank</button>;
 * }
 *
 * return <span>{walletCount} bank(s) connected</span>;
 * ```
 */
export function useBankConnection(): UseBankConnectionReturn {
  const { open, ready, isLoading, error } = usePlaid();
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const fetchWallets = useCallback(async () => {
    const result = await getUserWallets();
    if (result.ok) {
      setWallets(result.wallets ?? []);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const openPlaidLink = useCallback(() => {
    if (ready) {
      open();
    }
  }, [open, ready]);

  return {
    isConnected: wallets.length > 0,
    wallets,
    walletCount: wallets.length,
    openPlaidLink,
    isLinkReady: ready,
    isLinkLoading: isLoading,
    linkError: error,
    refresh: fetchWallets,
  };
}
