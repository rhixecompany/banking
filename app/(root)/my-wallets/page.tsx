import type { Metadata } from "next";

import { Suspense } from "react";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { MyWalletsServerWrapper } from "@/components/my-wallets/my-wallets-server-wrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * My Wallets page metadata.
 * Accessible only to authenticated users.
 *
 * @export
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "View and manage your linked wallet accounts.",
  title: "My Wallets | Horizon Banking",
};

/**
 * My Wallets page — delegates all data fetching and rendering to MyWalletsServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function MyWalletsPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <MyWalletsServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
