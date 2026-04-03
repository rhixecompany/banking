import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";
import { getUserBanks } from "@/lib/actions/bank.actions";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  description: "Your financial overview",
  title: "Dashboard | Banking",
};

/**
 * Server wrapper for the dashboard page.
 * Handles authentication, fetches the user's linked banks, and passes data to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function DashboardServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const banksResult = await getUserBanks();
  const banks = banksResult.ok ? (banksResult.banks ?? []) : [];

  return (
    <DashboardClientWrapper
      banks={banks}
      userId={userId}
      userName={session.user.name ?? "User"}
      showOnboarding={banks.length === 0}
    />
  );
}
