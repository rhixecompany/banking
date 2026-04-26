import type { Metadata } from "next";

import { Suspense } from "react";

import { HomeServerWrapper } from "@/components/home/home-server-wrapper";
import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { LoadingSpinner } from "@/components/ui/spinner";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Manage your bank accounts and transactions",
  title: "Home | Horizon Banking",
};

/**
 * Home page route — publicly accessible, no auth required.
 */
export default function HomePage(): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={<LoadingSpinner className="flex-center min-h-screen" />}
      >
        <HomeServerWrapper />
      </Suspense>
    </RootLayoutWrapper>
  );
}
