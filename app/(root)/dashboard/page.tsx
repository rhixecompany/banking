import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

export const metadata: Metadata = {
  description: "Your financial overview",
  title: "Dashboard | Banking",
};

/**
 * Dashboard page component.
 * Displays user overview with linked banks, total balance, and quick actions.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;
  const banks = await bankDal.findByUserId(userId);

  return (
    <DashboardClient
      banks={banks}
      userId={userId}
      userName={session.user.name ?? "User"}
    />
  );
}
