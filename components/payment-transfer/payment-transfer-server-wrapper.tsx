import { redirect } from "next/navigation";

import { PaymentTransferClientWrapper } from "@/components/payment-transfer/payment-transfer-client-wrapper";
import { getRecipients } from "@/lib/actions/recipient.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

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

  const userId = session.user.id;

  const [banks, recipientsResult] = await Promise.all([
    bankDal.findByUserId(userId),
    getRecipients(),
  ]);

  const recipients = recipientsResult.ok
    ? (recipientsResult.recipients ?? [])
    : [];

  return <PaymentTransferClientWrapper banks={banks} recipients={recipients} />;
}
