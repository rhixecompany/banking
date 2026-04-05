import AdminDashboardContent from "@/components/admin/admin-dashboard-content";

/**
 * Server wrapper for the admin dashboard.
 * Renders the AdminDashboardContent client component.
 */
export async function AdminDashboardServerWrapper(): Promise<JSX.Element> {
  return <AdminDashboardContent />;
}
