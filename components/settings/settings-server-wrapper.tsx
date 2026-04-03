import { redirect } from "next/navigation";

import { SettingsClientWrapper } from "@/components/settings/settings-client-wrapper";
import ConnectedAccount from "@/components/shadcn-studio/blocks/account-settings-01/content/connect-account";
import DangerZone from "@/components/shadcn-studio/blocks/account-settings-01/content/danger-zone";
import SocialUrl from "@/components/shadcn-studio/blocks/account-settings-01/content/social-url";
import { getUserWithProfile } from "@/lib/actions/user.actions";

/**
 * Server wrapper for the Settings page.
 * Handles auth and fetches the user's profile, then delegates to the client wrapper.
 * Renders additional UI-only settings sections below the main wired form.
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

  return (
    <section className="space-y-10">
      <SettingsClientWrapper userWithProfile={result.user} />
      <ConnectedAccount />
      <SocialUrl />
      <DangerZone />
    </section>
  );
}
