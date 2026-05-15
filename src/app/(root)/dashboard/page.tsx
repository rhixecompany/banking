import type { Metadata } from "next";

import { Suspense } from "react";

import { DashboardServerWrapper } from "@/components/dashboard/dashboard-server-wrapper";
import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Your financial overview",
  title: "Dashboard | Horizon Banking",
};

/**
 * Dashboard page.
 * Delegates all auth, data-fetching, and rendering to DashboardServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function DashboardPage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <DashboardServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
