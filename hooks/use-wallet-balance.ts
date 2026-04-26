/**
 * useWalletBalance hook — provides wallet and account balance data.
 * Fetches user wallets and Plaid accounts with balances.
 */

import { useCallback, useEffect, useState } from "react";

import type { Wallet } from "@/types/wallet";

import { getAllAccounts } from "@/actions/plaid.actions";
import { getUserWallets } from "@/actions/wallet.actions";

/**
 * Account data from Plaid.
 */
export interface AccountData {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName?: string;
  mask?: string;
  institutionId?: string;
  name: string;
  type: string;
  subtype?: string;
  sharableId?: string;
}

/**
 * Hook return type for wallet balance data.
 */
export interface UseWalletBalanceReturn {
  /** All linked wallet records. */
  wallets: Wallet[];
  /** All Plaid account records with balances. */
  accounts: AccountData[];
  /** Sum of all account balances. */
  totalBalance: number;
  /** Count of linked wallets. */
  totalWallets: number;
  /** Whether data is currently loading. */
  isLoading: boolean;
  /** Error message if fetch failed. */
  error?: string;
  /** Refresh wallet and account data. */
  refresh: () => Promise<void>;
}

/**
 * Fetches user wallets and Plaid accounts with aggregated balance data.
 * Provides total balance across all accounts.
 *
 * @example
 * ```tsx
 * const { wallets, accounts, totalBalance, isLoading, refresh } = useWalletBalance();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     <span>Total: ${totalBalance}</span>
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useWalletBalance(): UseWalletBalanceReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const [walletsResult, accountsResult] = await Promise.all([
        getUserWallets(),
        getAllAccounts(),
      ]);

      if (!walletsResult.ok) {
        setError(walletsResult.error ?? "Failed to fetch wallets");
        setWallets([]);
      } else {
        setWallets(walletsResult.wallets ?? []);
      }

      if (!accountsResult.ok) {
        setError(
          (prev) => prev ?? accountsResult.error ?? "Failed to fetch accounts",
        );
        setAccounts([]);
      } else {
        setAccounts(accountsResult.accounts ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setWallets([]);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate total balance from all accounts
  const totalBalance = accounts.reduce(
    (sum, account) => sum + (account.currentBalance ?? 0),
    0,
  );

  return {
    accounts,
    error,
    isLoading,
    refresh: fetchData,
    totalBalance,
    totalWallets: wallets.length,
    wallets,
  };
}
