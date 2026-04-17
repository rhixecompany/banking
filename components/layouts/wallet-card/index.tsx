"use client";

import { Trash2 } from "lucide-react";

import type { WalletWithDetails } from "@/types/wallet";

import { Button } from "@/components/ui/button";

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
   * @type {?boolean}
   */
  showActions?: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(walletId: string) => void | Promise<void>}
   */
  onRemove?: (walletId: string) => Promise<void> | void;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {WalletCardProps} param0
 * @param {WalletWithDetails} param0.wallet
 * @param {boolean} [param0.showActions=false]
 * @param {(walletId: string) => any} param0.onRemove
 * @returns {ReactJSX.Element}
 */
export default function WalletCard({
  onRemove,
  showActions = false,
  wallet,
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
