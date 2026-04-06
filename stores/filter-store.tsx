"use client";

/**
 * FilterStoreProvider — creates a per-mount Transaction Filter store instance
 * and exposes it via React Context. SSR-safe (no module-level singleton).
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  createFilterStore,
  defaultFilterState,
  type FilterState,
  type FilterStore,
} from "@/stores/create-filter-store";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @typedef {FilterStoreApi}
 */
type FilterStoreApi = ReturnType<typeof createFilterStore>;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const FilterStoreContext = createContext<FilterStoreApi | undefined>(undefined);

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface FilterStoreProviderProps
 * @typedef {FilterStoreProviderProps}
 */
interface FilterStoreProviderProps {
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
   * @type {?Partial<FilterState>}
   */
  initialState?: Partial<FilterState>;
}

/**
 * Wraps a subtree with a scoped Filter store instance.
 * Place around transaction-history pages or dashboards with filter UI.
 */
export function FilterStoreProvider({
  children,
  initialState,
}: FilterStoreProviderProps): JSX.Element {
  const [store] = useState(() =>
    createFilterStore({ ...defaultFilterState, ...initialState }),
  );

  return (
    <FilterStoreContext.Provider value={store}>
      {children}
    </FilterStoreContext.Provider>
  );
}

/** Access the raw Filter store API (rarely needed directly). */
export function useFilterStoreApi(): FilterStoreApi {
  const store = useContext(FilterStoreContext);
  if (!store) {
    throw new Error(
      "useFilterStoreApi must be used inside <FilterStoreProvider>",
    );
  }
  return store;
}

/** Select a single scalar value from the Filter store. */
export function useFilterStore<T>(selector: (state: FilterStore) => T): T {
  const store = useFilterStoreApi();
  return useStore(store, selector);
}

/**
 * Select multiple fields from the Filter store with shallow equality.
 * Use this when your selector returns an object to avoid infinite re-renders.
 */
export function useFilterStoreShallow<T extends object>(
  selector: (state: FilterStore) => T,
): T {
  const store = useFilterStoreApi();
  return useStore(store, useShallow(selector));
}
