import type { Metadata } from "next";

import { redirect } from "next/navigation";

import type { Bank, BankWithDetails } from "@/types/bank";
import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";

import { MyBanksClient } from "@/components/MyBanksClient";
import { getBankWithDetails } from "@/lib/actions/plaid.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

export const metadata: Metadata = {
  description: "View and manage your linked bank accounts.",
  title: "My Banks | Horizon Banking",
};

/**
 * Description placeholder
 *
 * @async
 * @param {string} userId
 * @returns {unknown}
 */
async function getUserBanks(userId: string) {
  "use cache";
  return await bankDal.findByUserId(userId);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function MyBanksPage(): Promise<JSX.Element> {
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
    <MyBanksClient
      banksWithDetails={banksWithDetails}
      totalBalance={totalBalance}
      userId={userId}
    />
  );
}
