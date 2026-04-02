import { redirect } from "next/navigation";

import { SettingsClientWrapper } from "@/components/settings/settings-client-wrapper";
import { getUserWithProfile } from "@/lib/actions/user.actions";

/**
 * Server wrapper for the Settings page.
 * Handles auth and fetches the user's profile, then delegates to the client wrapper.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function SettingsServerWrapper(): Promise<JSX.Element> {
  const result = await getUserWithProfile();
  if (!result.ok || !result.user) {
    redirect("/sign-in");
  }

  return <SettingsClientWrapper userWithProfile={result.user} />;
}
