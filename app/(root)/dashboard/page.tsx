import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/DashboardClient";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

/**
 * Dashboard page component.
 * Displays user overview with linked banks, total balance, and quick actions.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function DashboardPage(): Promise<JSX.Element> {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const banks = await bankDal.findByUserId(userId);

  return (
    <DashboardClient
      banks={banks}
      userId={userId}
      userName={user.name ?? "User"}
    />
  );
}
