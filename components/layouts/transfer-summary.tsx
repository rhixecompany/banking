import type { Recipient } from "@/types/recipient";
import type { Wallet } from "@/types/wallet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface Props
 * @typedef {Props}
 */
interface Props {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(null | Wallet)}
   */
  sourceWallet?: null | Wallet;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(null | Recipient)}
   */
  recipient?: null | Recipient;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(number | string)}
   */
  amount?: number | string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {Props} param0
 * @param {(string | number)} param0.amount
 * @param {*} param0.recipient
 * @param {*} param0.sourceWallet
 * @returns {ReactJSX.Element}
 */
export default function TransferSummary({
  amount,
  recipient,
  sourceWallet,
}: Props) {
  const amountNum = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transfer Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">From</span>
            <span className="font-medium">
              {sourceWallet
                ? (sourceWallet.institutionName ?? "Unknown Bank")
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">To</span>
            <span className="font-medium">
              {recipient ? (recipient.name ?? recipient.email) : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">
              {Number(amountNum) > 0 ? (
                <span data-testid="transfer-summary-amount">{`$${Number(
                  amountNum,
                ).toFixed(2)}`}</span>
              ) : (
                "—"
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
