import { NotFoundClientWrapper } from "@/components/not-found/not-found-client-wrapper";

/**
 * Server wrapper for the 404 Not Found page.
 * Purely presentational — no auth or data fetching required.
 *
 * @export
 * @returns {JSX.Element}
 */
export function NotFoundServerWrapper(): JSX.Element {
  return <NotFoundClientWrapper />;
}
