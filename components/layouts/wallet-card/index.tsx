"use client";

import { Trash2 } from "lucide-react";

import type { WalletWithDetails } from "@/types/wallet";

import { Button } from "@/components/ui/button";

interface WalletCardProps {
  wallet: WalletWithDetails;
  showActions?: boolean;
  onRemove?: (walletId: string) => void | Promise<void>;
}

export default function WalletCard({
  wallet,
  showActions = false,
  onRemove,
}: WalletCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
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
          {wallet.balances?.[0]?.balances?.current ?? "$0.00"}
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
  );
}
