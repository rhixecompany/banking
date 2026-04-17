"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import type { WalletWithDetails } from "@/types/wallet";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface WalletCardProps
 * @typedef {WalletCardProps}
 */
interface WalletCardProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {WalletWithDetails}
   */
  wallet: WalletWithDetails;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(input: unknown) => Promise<{ ok: boolean; error?: string }>}
   */
  removeWallet: (input: unknown) => Promise<{ ok: boolean; error?: string }>;
  // Optional flag to show or hide inline actions (used by some callers)
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?boolean}
   */
  showActions?: boolean;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {WalletCardProps} param0
 * @param {(input: unknown) => Promise<{ ok: boolean; error?: string; }>} param0.removeWallet
 * @param {WalletWithDetails} param0.wallet
 * @param {boolean} param0.showActions
 * @returns {JSX.Element}
 */
export default function WalletCard({
  removeWallet,
  showActions,
  wallet,
}: WalletCardProps): JSX.Element {
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
          {showActions !== false && (
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
          )}
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

        {/* TransactionList is rendered by the parent; keep layout consistent. */}
      </CardContent>
    </Card>
  );
}
