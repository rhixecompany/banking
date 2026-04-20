import type { Metadata } from "next";

import { HomeServerWrapper } from "@/components/home/home-server-wrapper";
import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";

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
      <HomeServerWrapper />
    </RootLayoutWrapper>
  );
}
