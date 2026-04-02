import { redirect } from "next/navigation";

import { SettingsClientWrapper } from "@/components/settings/settings-client-wrapper";
import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

/**
 * Server wrapper for the Settings page.
 * Handles auth and fetches the user's profile, then delegates to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function SettingsServerWrapper(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userWithProfile = await userDal.findByIdWithProfile(session.user.id);
  if (!userWithProfile) {
    redirect("/sign-in");
  }

  return <SettingsClientWrapper userWithProfile={userWithProfile} />;
}
