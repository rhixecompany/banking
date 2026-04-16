import { Badge } from "@/components/ui/badge";
import { formatAmount, formatDate } from "@/lib/utils";
import type { PlaidTransaction } from "@/types/plaid";

export default function TransactionList({
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
                  className={`font-semibold ${tx.amount < 0 ? "text-green-600" : "text-destructive"}`}
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
