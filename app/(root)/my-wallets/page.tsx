import type { Metadata } from "next";

import { MyWalletsServerWrapper } from "@/components/my-wallets/my-wallets-server-wrapper";

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
  return <MyWalletsServerWrapper />;
}
