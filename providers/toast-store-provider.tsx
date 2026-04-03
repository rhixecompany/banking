"use client";

/**
 * ToastStoreProvider — creates a per-mount Toast Queue store instance
 * and exposes it via React Context. SSR-safe (no module-level singleton).
 */

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  createToastStore,
  defaultToastState,
  type ToastState,
  type ToastStore,
} from "@/lib/stores/create-toast-store";

type ToastStoreApi = ReturnType<typeof createToastStore>;

const ToastStoreContext = createContext<ToastStoreApi | null>(null);

interface ToastStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<ToastState>;
}

/**
 * Wraps a subtree with a scoped Toast Queue store instance.
 * Typically placed at the root level (RootProviders) so any component
 * can push toasts from Server Action result handlers.
 */
export function ToastStoreProvider({
  children,
  initialState,
}: ToastStoreProviderProps): JSX.Element {
  const storeRef = useRef<ToastStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createToastStore({
      ...defaultToastState,
      ...initialState,
    });
  }

  return (
    <ToastStoreContext.Provider value={storeRef.current}>
      {children}
    </ToastStoreContext.Provider>
  );
}

/** Access the raw Toast store API (rarely needed directly). */
export function useToastStoreApi(): ToastStoreApi {
  const store = useContext(ToastStoreContext);
  if (!store) {
    throw new Error(
      "useToastStoreApi must be used inside <ToastStoreProvider>",
    );
  }
  return store;
}

/** Select a single scalar value from the Toast store. */
export function useToastStore<T>(selector: (state: ToastStore) => T): T {
  const store = useToastStoreApi();
  return useStore(store, selector);
}

/**
 * Select multiple fields from the Toast store with shallow equality.
 * Use this when your selector returns an object to avoid infinite re-renders.
 */
export function useToastStoreShallow<T extends object>(
  selector: (state: ToastStore) => T,
): T {
  const store = useToastStoreApi();
  return useStore(store, useShallow(selector));
}
