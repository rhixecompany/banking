import { redirect } from "next/navigation";

import type { Bank, BankWithDetails } from "@/types/bank";
import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";

import { MyBanksClientWrapper } from "@/components/my-banks/my-banks-client-wrapper";
import { getBankWithDetails } from "@/lib/actions/plaid.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

/**
 * Fetches the user's linked banks with caching.
 *
 * @param {string} userId
 * @returns {Promise<Bank[]>}
 */
async function getUserBanks(userId: string): Promise<Bank[]> {
  "use cache";
  return await bankDal.findByUserId(userId);
}

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
  const banks = await getUserBanks(userId);

  const banksWithDetails: BankWithDetails[] = await Promise.all(
    banks.map(async (bank): Promise<BankWithDetails> => {
      const result = await getBankWithDetails(bank.id);
      return {
        ...(bank as Bank),
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
