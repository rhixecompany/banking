import { Suspense } from "react";

import { RootProviders } from "@/stores/providers";

import PageShell from "./PageShell";

/**
 * Loading fallback while session loads - prevents blocking route errors with Cache Components
 */
function SessionLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8  animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Props}
 */
interface Props {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {Props} param0
 * @param {React.ReactNode} param0.children
 * @returns {ReactJSX.Element}
 */
export default function RootLayoutWrapper({ children }: Props) {
  return (
    <Suspense fallback={<SessionLoadingFallback />}>
      <RootProviders>
        <PageShell>{children}</PageShell>
      </RootProviders>
    </Suspense>
  );
}
