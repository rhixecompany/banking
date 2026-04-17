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
 * Description placeholder
 * @author Adminbot
 *
 * @interface WalletsOverviewProps
 * @typedef {WalletsOverviewProps}
 */
interface WalletsOverviewProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {WalletWithDetails[]}
   */
  walletsWithDetails: WalletWithDetails[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  totalBalance?: number;
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
   * @type {?(walletId: string) => Promise<void> | void}
   */
  onRemove?: (walletId: string) => Promise<void> | void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  className?: string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {WalletsOverviewProps} param0
 * @param {string} param0.className
 * @param {(walletId: string) => any} param0.onRemove
 * @param {boolean} [param0.showActions=false]
 * @param {number} param0.totalBalance
 * @param {{}} param0.walletsWithDetails
 * @returns {ReactJSX.Element}
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
                    // Support callers that pass a simple walletId string via onRemove
                    const walletId =
                      typeof input === "string"
                        ? input
                        : (input as { walletId?: string } | undefined)
                            ?.walletId;

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
