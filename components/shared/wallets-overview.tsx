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

interface WalletsOverviewProps {
  walletsWithDetails: WalletWithDetails[];
  totalBalance?: number;
  showActions?: boolean;
  onRemove?: (walletId: string) => Promise<void> | void;
  className?: string;
}

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
                  onRemove={onRemove}
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
