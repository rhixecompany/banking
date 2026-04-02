import type { Metadata } from "next";

import { PaymentTransferServerWrapper } from "@/components/payment-transfer/payment-transfer-server-wrapper";

export const metadata: Metadata = {
  description: "Send money to recipients using ACH bank transfers.",
  title: "Payment Transfer | Horizon Banking",
};

/**
 * Payment Transfer page — delegates to PaymentTransferServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function PaymentTransferPage(): JSX.Element {
  return <PaymentTransferServerWrapper />;
}
