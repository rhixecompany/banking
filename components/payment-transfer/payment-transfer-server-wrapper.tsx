import { redirect } from "next/navigation";

import { getRecipients } from "@/actions/recipient.actions";
import { getUserWallets } from "@/actions/wallet.actions";
import { PaymentTransferClientWrapper } from "@/components/payment-transfer/payment-transfer-client-wrapper";
import { auth } from "@/lib/auth";

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
    <PaymentTransferClientWrapper wallets={wallets} recipients={recipients} />
  );
}
