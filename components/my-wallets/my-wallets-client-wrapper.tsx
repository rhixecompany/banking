"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { PlaidLinkButton } from "@/components/plaid-link-button/plaid-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount, formatDate } from "@/lib/utils";
import type { PlaidTransaction } from "@/types/plaid";
import type { WalletWithDetails } from "@/types/wallet";

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
  totalBalance,
  userId,
  walletsWithDetails,
  removeWallet,
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
  totalBalance,
  walletsWithDetails,
  removeWallet,
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
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              removeWallet={removeWallet}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Renders a single wallet card with balance details, a delete button, and a
 * list of recent transactions. Each card has its own `useTransition` so that
 * only the button for the wallet being deleted is disabled — not all buttons
 * simultaneously.
 */
function WalletCard({
  wallet,
  removeWallet,
}: {
  wallet: WalletWithDetails;
  removeWallet: (input: unknown) => Promise<{ ok: boolean; error?: string }>;
}): JSX.Element {
  const [isPending, startTransition] = useTransition();

  function handleRemove(): void {
    startTransition(async () => {
      const result = await removeWallet({ walletId: wallet.id });
      if (!result.ok) {
        toast.error(result.error ?? "Failed to remove wallet.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">
            {wallet.institutionName ?? "Unknown Institution"}
          </CardTitle>
          <CardDescription>
            {wallet.accountType} - {wallet.accountSubtype}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold">
              {formatAmount(wallet.balances[0]?.balances?.current ?? 0)}
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              disabled={isPending}
              type="button"
              aria-label={`Remove ${wallet.institutionName ?? "wallet"}`}
              onClick={handleRemove}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {wallet.balances.length > 0 && (
          <div className="mb-6 grid gap-4 rounded-lg bg-muted p-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-lg font-semibold">
                {formatAmount(wallet.balances[0]?.balances?.available ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Current</div>
              <div className="text-lg font-semibold">
                {formatAmount(wallet.balances[0]?.balances?.current ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Limit</div>
              <div className="text-lg font-semibold">
                {wallet.balances[0]?.balances?.limit
                  ? formatAmount(wallet.balances[0].balances.limit)
                  : "N/A"}
              </div>
            </div>
          </div>
        )}

        <TransactionList transactions={wallet.transactions} />
      </CardContent>
    </Card>
  );
}

/**
 * Renders up to five recent transactions for a wallet card.
 */
function TransactionList({
  transactions,
}: {
  transactions: PlaidTransaction[];
}): JSX.Element {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">Recent Transactions</h4>
      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent transactions</p>
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div
              key={tx.transactionId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <span className="text-lg">
                    {tx.name[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{tx.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(tx.date)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    tx.amount < 0 ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {formatAmount(Math.abs(tx.amount))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {tx.category?.[0] ?? "Other"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
