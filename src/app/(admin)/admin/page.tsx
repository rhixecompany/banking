import type { Metadata } from "next";

import { Suspense } from "react";

import { AdminDashboardServerWrapper } from "@/components/admin/admin-dashboard-server-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Admin overview — statistics, transactions, and metrics.",
  title: "Admin Dashboard | Horizon Banking",
};

/**
 * Loading skeleton for admin dashboard
 */
function AdminLoadingFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

/**
 * Admin dashboard page.
 * Accessible at /admin — protected by (admin)/layout.tsx auth + isAdmin guard.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function AdminPage(): JSX.Element {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminDashboardServerWrapper />
    </Suspense>
  );
}
