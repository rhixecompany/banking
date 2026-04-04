import type { Metadata } from "next";

import { HomeServerWrapper } from "@/components/home/home-server-wrapper";

export const metadata: Metadata = {
  description: "Manage your bank accounts and transactions",
  title: "Home | Horizon Banking",
};

/**
 * Home page route — publicly accessible, no auth required.
 */
export default function HomePage(): JSX.Element {
  return <HomeServerWrapper />;
}
