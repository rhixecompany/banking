"use client";

/**
 * RootProviders — composes all application-level providers in one place.
 *
 * Order (innermost first, matters for context resolution):
 *   SessionProvider → UIStoreProvider → ToastStoreProvider
 *
 * Notes:
 * - TransferStoreProvider and FilterStoreProvider are page-scoped, not root-scoped,
 *   because they carry wizard/filter state that should reset between navigations.
 *   Use them directly around the relevant page layouts or components.
 * - Toaster (sonner) is rendered in app/layout.tsx, not here, to stay outside
 *   the client boundary and avoid hydration issues.
 */

import type { ReactNode } from "react";

import { SessionProvider } from "@/components/providers/session-provider";
import { ToastStoreProvider } from "@/providers/toast-store-provider";
import { UIStoreProvider } from "@/providers/ui-store-provider";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface RootProvidersProps
 * @typedef {RootProvidersProps}
 */
interface RootProvidersProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {ReactNode}
   */
  children: ReactNode;
}

/**
 * Wraps the application with all root-level context providers.
 * Replace the inline `<SessionProvider>` in `app/layout.tsx` with this component.
 */
export function RootProviders({ children }: RootProvidersProps): JSX.Element {
  return (
    <SessionProvider>
      <UIStoreProvider>
        <ToastStoreProvider>{children}</ToastStoreProvider>
      </UIStoreProvider>
    </SessionProvider>
  );
}
