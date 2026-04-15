"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";
import type { WalletWithDetails } from "@/types/wallet";

type WalletsOverviewProps = {
  walletsWithDetails: WalletWithDetails[];
  totalBalance?: number;
  showActions?: boolean;
  onRemove?: (walletId: string) => Promise<void> | void;
  className?: string;
};

export default function WalletsOverview({
  walletsWithDetails,
  totalBalance,
  showActions = false,
  onRemove,
  className,
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
                <div
                  key={wallet.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {wallet.institutionName ?? "Unknown Wallet"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {wallet.accountType ?? "Account"} -{" "}
                      {wallet.accountSubtype ?? "Standard"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Balance</div>
                    <div className="text-base font-semibold">
                      {formatAmount(wallet.balances[0]?.balances?.current ?? 0)}
                    </div>
                    {showActions && (
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${wallet.institutionName ?? "wallet"}`}
                          onClick={() => onRemove?.(wallet.id)}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
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
