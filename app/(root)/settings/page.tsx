import type { Metadata } from "next";

import { SettingsServerWrapper } from "@/components/settings/settings-server-wrapper";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Manage your account preferences and profile.",
  title: "Settings | Horizon Banking",
};

/**
 * Settings page — delegates auth, data fetching, and rendering
 * to SettingsServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function SettingsPage(): JSX.Element {
  return <SettingsServerWrapper />;
}
