import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { SettingsClient } from "@/components/settings/SettingsClient";
import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

export const metadata: Metadata = {
  description: "Manage your account preferences and profile.",
  title: "Settings | Horizon Banking",
};

/**
 * Settings page — loads the current user's profile data
 * and renders the profile form.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function SettingsPage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userWithProfile = await userDal.findByIdWithProfile(session.user.id);
  if (!userWithProfile) {
    redirect("/sign-in");
  }

  return <SettingsClient userWithProfile={userWithProfile} />;
}
