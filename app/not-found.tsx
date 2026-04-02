import type { Metadata } from "next";

import { NotFoundServerWrapper } from "@/components/not-found/not-found-server-wrapper";

export const metadata: Metadata = {
  description: "The page you are looking for does not exist.",
  title: "Page Not Found | Banking",
};

/**
 * Not Found page — delegates rendering to NotFoundServerWrapper.
 *
 * @export
 * @returns {JSX.Element}
 */
export default function NotFound(): JSX.Element {
  return <NotFoundServerWrapper />;
}
