import type { Metadata } from "next";

import { Suspense } from "react";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { SettingsServerWrapper } from "@/components/settings/settings-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

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
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <SettingsServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
