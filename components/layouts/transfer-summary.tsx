import type { Recipient } from "@/types/recipient";
import type { Wallet } from "@/types/wallet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  sourceWallet?: null | Wallet;
  recipient?: null | Recipient;
  amount?: number | string;
}

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
