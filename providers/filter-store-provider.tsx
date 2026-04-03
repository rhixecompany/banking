"use client";

/**
 * FilterStoreProvider — creates a per-mount Transaction Filter store instance
 * and exposes it via React Context. SSR-safe (no module-level singleton).
 */

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import {
  createFilterStore,
  defaultFilterState,
  type FilterState,
  type FilterStore,
} from "@/lib/stores/create-filter-store";

type FilterStoreApi = ReturnType<typeof createFilterStore>;

const FilterStoreContext = createContext<FilterStoreApi | null>(null);

interface FilterStoreProviderProps {
  children: ReactNode;
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
  const storeRef = useRef<FilterStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createFilterStore({
      ...defaultFilterState,
      ...initialState,
    });
  }

  return (
    <FilterStoreContext.Provider value={storeRef.current}>
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
