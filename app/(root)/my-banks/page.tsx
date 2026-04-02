import type { Metadata } from "next";

import { MyBanksServerWrapper } from "@/components/my-banks/my-banks-server-wrapper";

export const metadata: Metadata = {
  description: "View and manage your linked bank accounts.",
  title: "My Banks | Horizon Banking",
};

/**
 * My Banks page — delegates all data fetching and rendering to MyBanksServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function MyBanksPage(): JSX.Element {
  return <MyBanksServerWrapper />;
}
