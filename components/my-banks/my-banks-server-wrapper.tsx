import { redirect } from "next/navigation";

import type { BankWithDetails } from "@/types/bank";
import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";

import { MyBanksClientWrapper } from "@/components/my-banks/my-banks-client-wrapper";
import { getUserBanks } from "@/lib/actions/bank.actions";
import { getBankWithDetails } from "@/lib/actions/plaid.actions";
import { auth } from "@/lib/auth";

/**
 * Server wrapper for the My Banks page.
 * Handles authentication, fetches banks with live Plaid data, and computes
 * the total balance before passing everything to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function MyBanksServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const banksResult = await getUserBanks();
  const banks = banksResult.ok ? (banksResult.banks ?? []) : [];

  const banksWithDetails: BankWithDetails[] = await Promise.all(
    banks.map(async (bank): Promise<BankWithDetails> => {
      const result = await getBankWithDetails(bank.id);
      return {
        ...bank,
        balances: (result.balances as PlaidBalance[]) ?? [],
        transactions: (result.transactions as PlaidTransaction[]) ?? [],
      };
    }),
  );

  const totalBalance = banksWithDetails.reduce((sum, bank) => {
    return sum + (bank.balances[0]?.balances?.current ?? 0);
  }, 0);

  return (
    <MyBanksClientWrapper
      banksWithDetails={banksWithDetails}
      totalBalance={totalBalance}
      userId={userId}
    />
  );
}
