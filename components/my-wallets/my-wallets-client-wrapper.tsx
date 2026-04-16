"use client";

import type { WalletWithDetails } from "@/types/wallet";

import TransactionList from "@/components/layouts/transaction-list";
import WalletCard from "@/components/layouts/wallet-card";
import { PlaidLinkButton } from "@/components/plaid-link-button/plaid-link-button";
import { Card, CardContent } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

/**
 * Props for the My Wallets client wrapper.
 */
interface MyWalletsClientWrapperProps {
  /** Wallets enriched with live Plaid balance and transaction data. */
  walletsWithDetails: WalletWithDetails[];
  /** Sum of the current balance across all linked wallets. */
  totalBalance: number;
  /** The authenticated user's ID, used by PlaidProvider. */
  userId: string;
  /** Server action to remove a wallet (passed from the server wrapper). */
  removeWallet: (input: unknown) => Promise<{ ok: boolean; error?: string }>;
}

/**
 * Client wrapper for the My Wallets page.
 * Provides the PlaidProvider context required for the link button.
 *
 * @export
 * @param {MyWalletsClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function MyWalletsClientWrapper({
  removeWallet,
  totalBalance,
  userId,
  walletsWithDetails,
}: MyWalletsClientWrapperProps): JSX.Element {
  return (
    <MyWalletsContent
      walletsWithDetails={walletsWithDetails}
      totalBalance={totalBalance}
      userId={userId}
      removeWallet={removeWallet}
    />
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/**
 * Renders the full My Wallets layout including the header, total-balance card,
 * and the list of linked wallet cards.
 */
function MyWalletsContent({
  removeWallet,
  totalBalance,
  walletsWithDetails,
}: MyWalletsClientWrapperProps): JSX.Element {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wallets</h1>
          <p className="text-muted-foreground">
            Manage your linked wallet accounts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold">
              {formatAmount(totalBalance)}
            </div>
          </Card>
          <PlaidLinkButton variant="default">Add Wallet</PlaidLinkButton>
        </div>
      </header>

      {walletsWithDetails.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No wallets linked</h3>
              <p className="text-muted-foreground">
                Link a wallet account to get started
              </p>
            </div>
            <PlaidLinkButton variant="default">
              Link Your First Wallet
            </PlaidLinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {walletsWithDetails.map((wallet) => (
            <div key={wallet.id}>
              <WalletCard wallet={wallet} removeWallet={removeWallet} />
              <TransactionList transactions={wallet.transactions} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// WalletCard and TransactionList are provided by the extracted layout
// components imported at the top of this file. Do not redeclare them here
// or they will shadow the imports.
