import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

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
  const banks = await bankDal.findByUserId(userId);

  return (
    <DashboardClientWrapper
      banks={banks}
      userId={userId}
      userName={session.user.name ?? "User"}
    />
  );
}
