import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { PaymentTransferClient } from "@/components/payment-transfer/PaymentTransferClient";
import { getRecipients } from "@/lib/actions/recipient.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

export const metadata: Metadata = {
  description: "Send money to recipients using ACH bank transfers.",
  title: "Payment Transfer | Horizon Banking",
};

/**
 * Payment Transfer page — loads the user's banks and recipients,
 * then renders the transfer form client component.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function PaymentTransferPage(): Promise<JSX.Element> {
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

  return (
    <PaymentTransferClient
      banks={banks}
      recipients={recipients}
      userId={userId}
    />
  );
}
