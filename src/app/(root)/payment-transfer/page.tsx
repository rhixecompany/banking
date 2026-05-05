import type { Metadata } from "next";

import { Suspense } from "react";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { PaymentTransferServerWrapper } from "@/components/payment-transfer/payment-transfer-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
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
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <PaymentTransferServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
