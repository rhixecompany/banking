import type { Metadata } from "next";

import { DashboardServerWrapper } from "@/components/dashboard/dashboard-server-wrapper";

export const metadata: Metadata = {
  description: "Your financial overview",
  title: "Dashboard | Banking",
};

/**
 * Dashboard page.
 * Delegates all auth, data-fetching, and rendering to DashboardServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function DashboardPage(): JSX.Element {
  return <DashboardServerWrapper />;
}
