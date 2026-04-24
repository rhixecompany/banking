import { redirect } from "next/navigation";

import { updateProfile } from "@/actions/updateProfile";
import { getUserWithProfile } from "@/actions/user.actions";
import SettingsClientWrapper from "@/components/layouts/settings-client";
import ConnectedAccount from "@/components/shadcn-studio/blocks/account-settings-01/content/connect-account";
import DangerZone from "@/components/shadcn-studio/blocks/account-settings-01/content/danger-zone";
import SocialUrl from "@/components/shadcn-studio/blocks/account-settings-01/content/social-url";

/**
 * Server wrapper for the Settings page.
 * getUserWithProfile handles auth internally (calls auth(), returns {ok, user}).
 * Renders additional UI-only settings sections below the main wired form.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export async function SettingsServerWrapper(): Promise<JSX.Element> {
  // getUserWithProfile already checks auth and returns {ok: false} if unauthenticated
  const result = await getUserWithProfile();
  if (!result.ok || !result.user) {
    // Action handles "Unauthorized" error; redirect to sign-in
    redirect("/sign-in");
  }

  return (
    <section className="space-y-10">
      <SettingsClientWrapper
        userWithProfile={result.user}
        updateProfile={updateProfile}
      />
      <ConnectedAccount />
      <SocialUrl />
      <DangerZone />
    </section>
  );
}
