import type { Metadata } from "next";

import { AdminDashboardServerWrapper } from "@/components/admin/admin-dashboard-server-wrapper";

export const metadata: Metadata = {
  description: "Admin overview — statistics, transactions, and metrics.",
  title: "Admin Dashboard | Horizon Banking",
};

/**
 * Admin dashboard page.
 * Accessible at /admin — protected by (admin)/layout.tsx auth + isAdmin guard.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function AdminPage(): JSX.Element {
  return <AdminDashboardServerWrapper />;
}
