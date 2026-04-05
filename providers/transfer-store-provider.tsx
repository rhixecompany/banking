"use client";

/**
 * TransferStoreProvider — creates a per-mount Transfer Wizard store instance
 * and exposes it via React Context. SSR-safe (no module-level singleton).
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  createTransferStore,
  defaultTransferState,
  type TransferState,
  type TransferStore,
} from "@/lib/stores/create-transfer-store";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @typedef {TransferStoreApi}
 */
type TransferStoreApi = ReturnType<typeof createTransferStore>;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const TransferStoreContext = createContext<TransferStoreApi | undefined>(
  undefined,
);

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface TransferStoreProviderProps
 * @typedef {TransferStoreProviderProps}
 */
interface TransferStoreProviderProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {ReactNode}
   */
  children: ReactNode;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?Partial<TransferState>}
   */
  initialState?: Partial<TransferState>;
}

/**
 * Wraps a subtree with a scoped Transfer Wizard store instance.
 * Typically placed around the payment-transfer page or dialog.
 */
export function TransferStoreProvider({
  children,
  initialState,
}: TransferStoreProviderProps): JSX.Element {
  const [store] = useState(() =>
    createTransferStore({ ...defaultTransferState, ...initialState }),
  );

  return (
    <TransferStoreContext.Provider value={store}>
      {children}
    </TransferStoreContext.Provider>
  );
}

/** Access the raw Transfer store API (rarely needed directly). */
export function useTransferStoreApi(): TransferStoreApi {
  const store = useContext(TransferStoreContext);
  if (!store) {
    throw new Error(
      "useTransferStoreApi must be used inside <TransferStoreProvider>",
    );
  }
  return store;
}

/** Select a single scalar value from the Transfer store. */
export function useTransferStore<T>(selector: (state: TransferStore) => T): T {
  const store = useTransferStoreApi();
  return useStore(store, selector);
}

/**
 * Select multiple fields from the Transfer store with shallow equality.
 * Use this when your selector returns an object to avoid infinite re-renders.
 */
export function useTransferStoreShallow<T extends object>(
  selector: (state: TransferStore) => T,
): T {
  const store = useTransferStoreApi();
  return useStore(store, useShallow(selector));
}
