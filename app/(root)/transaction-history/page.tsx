import type { Metadata } from "next";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { TransactionHistoryServerWrapper } from "@/components/transaction-history/transaction-history-server-wrapper";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Browse your full transaction history.",
  title: "Transaction History | Horizon Banking",
};

/**
 * Transaction History page — delegates auth, data fetching, and rendering
 * to TransactionHistoryServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function TransactionHistoryPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <TransactionHistoryServerWrapper />
    </RootLayoutWrapper>
  );
}
