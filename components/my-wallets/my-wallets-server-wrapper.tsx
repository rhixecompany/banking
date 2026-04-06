import { redirect } from "next/navigation";

import { getAllWalletsWithDetails } from "@/actions/plaid.actions";
import { MyWalletsClientWrapper } from "@/components/my-wallets/my-wallets-client-wrapper";
import { auth } from "@/lib/auth";

/**
 * Server wrapper for the My Wallets page.
 * Handles authentication, fetches all wallets with their balances and
 * transactions in a single batched call (no N+1 queries), and passes
 * the enriched data to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function MyWalletsServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const result = await getAllWalletsWithDetails();

  const walletsWithDetails = result.ok ? (result.walletsWithDetails ?? []) : [];
  const totalBalance = result.ok ? (result.totalBalance ?? 0) : 0;

  return (
    <MyWalletsClientWrapper
      walletsWithDetails={walletsWithDetails}
      totalBalance={totalBalance}
      userId={userId}
    />
  );
}
