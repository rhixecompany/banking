"use client";

/**
 * UIStoreProvider — creates a per-request UI store and exposes it via React Context.
 * Using useRef initialization prevents the store from being re-created on re-renders
 * and ensures SSR safety (no module-level singleton).
 */

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  createUIStore,
  defaultUIState,
  type UIState,
  type UIStore,
} from "@/lib/stores/create-ui-store";

type UIStoreApi = ReturnType<typeof createUIStore>;

const UIStoreContext = createContext<UIStoreApi | null>(null);

interface UIStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<UIState>;
}

/**
 * Wraps a subtree with a scoped UI store instance.
 * Place high in the component tree (e.g., RootProviders).
 */
export function UIStoreProvider({
  children,
  initialState,
}: UIStoreProviderProps): JSX.Element {
  const storeRef = useRef<UIStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createUIStore({
      ...defaultUIState,
      ...initialState,
    });
  }

  return (
    <UIStoreContext.Provider value={storeRef.current}>
      {children}
    </UIStoreContext.Provider>
  );
}

/** Access the raw store API (rarely needed directly). */
export function useUIStoreApi(): UIStoreApi {
  const store = useContext(UIStoreContext);
  if (!store) {
    throw new Error("useUIStoreApi must be used inside <UIStoreProvider>");
  }
  return store;
}

/** Select a single scalar value from the UI store. */
export function useUIStore<T>(selector: (state: UIStore) => T): T {
  const store = useUIStoreApi();
  return useStore(store, selector);
}

/**
 * Select multiple fields from the UI store with shallow equality.
 * Use this when your selector returns an object to avoid infinite re-renders.
 */
export function useUIStoreShallow<T extends object>(
  selector: (state: UIStore) => T,
): T {
  const store = useUIStoreApi();
  return useStore(store, useShallow(selector));
}
