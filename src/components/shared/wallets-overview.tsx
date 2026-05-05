"use client";

import type { WalletWithDetails } from "@/types/wallet";

import WalletCard from "@/components/layouts/wallet-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

/**
 * Props for the WalletsOverview component
 */
interface WalletsOverviewProps {
  /** Array of wallet objects with transaction details */
  walletsWithDetails: WalletWithDetails[];
  /** Optional total balance across all wallets */
  totalBalance?: number;
  /** Whether to show action buttons on wallet cards */
  showActions?: boolean;
  /** Optional callback when a wallet is removed */
  onRemove?: (walletId: string) => Promise<void> | void;
  /** Optional CSS class name for the container */
  className?: string;
}

function getWalletId(input: unknown): string | undefined {
  if (typeof input === "string" && input.length > 0) {
    return input;
  }

  if (
    typeof input === "object" &&
    input !== null &&
    "walletId" in input &&
    typeof input.walletId === "string" &&
    input.walletId.length > 0
  ) {
    return input.walletId;
  }

  return undefined;
}

/**
 * Displays an overview of linked wallets with optional actions and total balance
 *
 * @param props - Component props
 * @returns JSX element containing wallet cards and optional total balance
 */
export default function WalletsOverview({
  className,
  onRemove,
  showActions = false,
  totalBalance,
  walletsWithDetails,
}: WalletsOverviewProps) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Linked Wallets</CardTitle>
          <CardDescription>
            Your connected financial institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletsWithDetails.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-4 text-muted-foreground">
                No wallets linked yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletsWithDetails.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  showActions={showActions}
                  // Adapt the optional onRemove handler to WalletCard's removeWallet signature
                  removeWallet={async (input: unknown) => {
                    const walletId = getWalletId(input);

                    if (!onRemove) {
                      return { ok: true };
                    }

                    try {
                      // If walletId cannot be determined, try passing the wallet.id from closure
                      await onRemove(walletId ?? wallet.id);
                      return { ok: true };
                    } catch (err) {
                      return { error: String(err), ok: false };
                    }
                  }}
                />
              ))}
            </div>
          )}
          {typeof totalBalance === "number" && (
            <div className="mt-3 text-right text-sm text-muted-foreground">
              Total Balance: {formatAmount(totalBalance)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
