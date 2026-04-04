/**
 * Transaction Filter Store — holds active filter state for transaction lists.
 * Supports date range, category, and free-text search filtering.
 * Uses createStore for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

export interface DateRange {
  /** ISO date string for range start, e.g. "2024-01-01". */
  from: string | undefined;
  /** ISO date string for range end, e.g. "2024-12-31". */
  to: string | undefined;
}

export interface FilterState {
  /** Active date range filter. Both null means no date filter applied. */
  dateRange: DateRange;
  /** Active category filter. Empty string means no category filter. */
  category: string;
  /** Free-text search query applied to transaction name/email. */
  searchQuery: string;
  /** Current page number (1-indexed). */
  page: number;
  /** Number of rows per page. */
  pageSize: number;
}

export interface FilterActions {
  /** Set or clear the date range filter. */
  setDateRange: (range: DateRange) => void;
  /** Set or clear the category filter. */
  setCategory: (category: string) => void;
  /** Set or clear the search query. */
  setSearchQuery: (query: string) => void;
  /** Set the current page (resets to 1 if filters change). */
  setPage: (page: number) => void;
  /** Set the page size. */
  setPageSize: (size: number) => void;
  /** Reset all filters to their defaults. */
  resetFilters: () => void;
}

export type FilterStore = FilterActions & FilterState;

export const defaultFilterState: FilterState = {
  category: "",
  dateRange: { from: undefined, to: undefined },
  page: 1,
  pageSize: 20,
  searchQuery: "",
};

/**
 * Factory function that creates a new Filter store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createFilterStore(initState: Partial<FilterState> = {}) {
  return createStore<FilterStore>()((set) => ({
    ...defaultFilterState,
    ...initState,

    resetFilters: () => set({ ...defaultFilterState }),

    setCategory: (category) => set({ category, page: 1 }),

    setDateRange: (range) => set({ dateRange: range, page: 1 }),

    setPage: (page) => set({ page }),

    setPageSize: (pageSize) => set({ page: 1, pageSize }),

    setSearchQuery: (searchQuery) => set({ page: 1, searchQuery }),
  }));
}
