import { redirect } from "next/navigation";

import { createTransfer } from "@/actions/dwolla.actions";
import { getRecipients } from "@/actions/recipient.actions";
import { getUserWallets } from "@/actions/wallet.actions";
import PaymentTransferClientWrapper from "@/components/layouts/payment-transfer-client";
import { auth } from "@/lib/auth";
import { TransferStoreProvider } from "@/stores/transfer-store";

/**
 * Server wrapper for the Payment Transfer page.
 * Handles auth, fetches wallets and recipients in parallel,
 * then delegates rendering to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function PaymentTransferServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [walletsResult, recipientsResult] = await Promise.all([
    getUserWallets(),
    getRecipients(),
  ]);

  const wallets = walletsResult.ok ? (walletsResult.wallets ?? []) : [];
  const recipients = recipientsResult.ok
    ? (recipientsResult.recipients ?? [])
    : [];

  return (
    <TransferStoreProvider>
      <PaymentTransferClientWrapper
        wallets={wallets}
        recipients={recipients}
        createTransfer={createTransfer}
      />
    </TransferStoreProvider>
  );
}
