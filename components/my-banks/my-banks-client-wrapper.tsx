"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import type { BankWithDetails } from "@/types/bank";
import type { PlaidTransaction } from "@/types/plaid";

import { PlaidProvider } from "@/components/plaid-context";
import { PlaidLinkButton } from "@/components/plaid-link-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { removeBank } from "@/lib/actions/plaid.actions";
import { formatAmount, formatDate } from "@/lib/utils";

/** Props for the My Banks client wrapper. */
interface MyBanksClientWrapperProps {
  /** Banks enriched with live Plaid balance and transaction data. */
  banksWithDetails: BankWithDetails[];
  /** Sum of the current balance across all linked banks. */
  totalBalance: number;
  /** The authenticated user's ID, used by PlaidProvider. */
  userId: string;
}

/**
 * Client wrapper for the My Banks page.
 * Provides the PlaidProvider context required for the link button.
 *
 * @export
 * @param {MyBanksClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function MyBanksClientWrapper({
  banksWithDetails,
  totalBalance,
  userId,
}: MyBanksClientWrapperProps): JSX.Element {
  return (
    <PlaidProvider userId={userId}>
      <MyBanksContent
        banksWithDetails={banksWithDetails}
        totalBalance={totalBalance}
        userId={userId}
      />
    </PlaidProvider>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/**
 * Renders the full My Banks layout including the header, total-balance card,
 * and the list of linked bank cards.
 */
function MyBanksContent({
  banksWithDetails,
  totalBalance,
}: MyBanksClientWrapperProps): JSX.Element {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Banks</h1>
          <p className="text-muted-foreground">
            Manage your linked bank accounts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="text-sm text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold">
              {formatAmount(totalBalance)}
            </div>
          </Card>
          <PlaidLinkButton variant="default">Add Bank</PlaidLinkButton>
        </div>
      </header>

      {banksWithDetails.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No banks linked</h3>
              <p className="text-muted-foreground">
                Link a bank account to get started
              </p>
            </div>
            <PlaidLinkButton variant="default">
              Link Your First Bank
            </PlaidLinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {banksWithDetails.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Renders a single bank card with balance details, a delete button, and a
 * list of recent transactions. Each card has its own `useTransition` so that
 * only the button for the bank being deleted is disabled — not all buttons
 * simultaneously.
 */
function BankCard({ bank }: { bank: BankWithDetails }): JSX.Element {
  const [isPending, startTransition] = useTransition();

  function handleRemove(): void {
    startTransition(async () => {
      const result = await removeBank({ bankId: bank.id });
      if (!result.ok) {
        toast.error(result.error ?? "Failed to remove bank.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">
            {bank.institutionName ?? "Unknown Bank"}
          </CardTitle>
          <CardDescription>
            {bank.accountType} - {bank.accountSubtype}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold">
              {formatAmount(bank.balances[0]?.balances?.current ?? 0)}
            </div>
          </div>
          <form action={handleRemove}>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              disabled={isPending}
              type="submit"
              aria-label={`Remove ${bank.institutionName ?? "bank"}`}
            >
              <Trash2 className="size-5" />
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {bank.balances.length > 0 && (
          <div className="mb-6 grid gap-4 rounded-lg bg-muted p-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Available</div>
              <div className="text-lg font-semibold">
                {formatAmount(bank.balances[0]?.balances?.available ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Current</div>
              <div className="text-lg font-semibold">
                {formatAmount(bank.balances[0]?.balances?.current ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Limit</div>
              <div className="text-lg font-semibold">
                {bank.balances[0]?.balances?.limit
                  ? formatAmount(bank.balances[0].balances.limit)
                  : "N/A"}
              </div>
            </div>
          </div>
        )}

        <TransactionList transactions={bank.transactions} />
      </CardContent>
    </Card>
  );
}

/**
 * Renders up to five recent transactions for a bank card.
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
