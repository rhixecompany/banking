import { redirect } from "next/navigation";

import { PaymentTransferClientWrapper } from "@/components/payment-transfer/payment-transfer-client-wrapper";
import { getUserBanks } from "@/lib/actions/bank.actions";
import { getRecipients } from "@/lib/actions/recipient.actions";
import { auth } from "@/lib/auth";

/**
 * Server wrapper for the Payment Transfer page.
 * Handles auth, fetches banks and recipients in parallel,
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

  const [banksResult, recipientsResult] = await Promise.all([
    getUserBanks(),
    getRecipients(),
  ]);

  const banks = banksResult.ok ? (banksResult.banks ?? []) : [];
  const recipients = recipientsResult.ok
    ? (recipientsResult.recipients ?? [])
    : [];

  return <PaymentTransferClientWrapper banks={banks} recipients={recipients} />;
}
