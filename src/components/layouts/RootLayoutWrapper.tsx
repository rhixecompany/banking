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
 * RootLayoutWrapper - Root layout wrapper with providers and loading states.
 * Wraps authenticated layout content with session providers.
 *
 * @description
 * Provides SSR-safe layout wrapping with Suspense for loading states.
 * Uses RootProviders for Zustand stores and session management.
 * Shows a spinner while session loads to prevent route blocking.
 *
 * @example
 * ```tsx
 * <RootLayoutWrapper>
 *   <Dashboard />
 * </RootLayoutWrapper>
 * ```
 *
 * @param props - Component props
 * @param props.children - Layout content to wrap
 * @returns Layout with providers and loading fallback
 */
interface Props {
  /** Layout content to wrap with providers */
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
