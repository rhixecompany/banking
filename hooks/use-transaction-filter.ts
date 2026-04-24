/**
 * useTransactionFilter hook — provides filter state management for transaction lists.
 */

import {
  useFilterStoreApi,
  useFilterStoreShallow,
} from "@/stores/filter-store";

import type {
  DateRange,
  FilterState,
  TransactionStatus,
} from "@/stores/create-filter-store";

/**
 * Hook return type combining filter state and actions.
 */
export interface UseTransactionFilterReturn extends FilterState {
  /** Set or clear the date range filter. */
  setDateRange: (range: DateRange) => void;
  /** Set or clear the category filter. */
  setCategory: (category: string) => void;
  /** Set or clear the status filter. */
  setStatus: (status: TransactionStatus) => void;
  /** Set or clear the search query. */
  setSearchQuery: (query: string) => void;
  /** Set the current page (resets to 1 if filters change). */
  setPage: (page: number) => void;
  /** Set the page size. */
  setPageSize: (size: number) => void;
  /** Reset all filters to their defaults. */
  resetFilters: () => void;
}

/**
 * Provides filter state management for transaction lists.
 * Supports date range, category, and free-text search filtering.
 *
 * @example
 * ```tsx
 * const filters = useTransactionFilter();
 * return (
 *   <div>
 *     <input value={filters.searchQuery} onChange={(e) => {
 *       filters.setSearchQuery(e.target.value);
 *     }} />
 *   </div>
 * );
 * ```
 */
export function useTransactionFilter(): UseTransactionFilterReturn {
  const store = useFilterStoreApi();
  const filterState = useFilterStoreShallow((s) => ({
    dateRange: s.dateRange,
    category: s.category,
    status: s.status,
    searchQuery: s.searchQuery,
    page: s.page,
    pageSize: s.pageSize,
  }));

  return {
    ...filterState,
    setDateRange: store.getState().setDateRange,
    setCategory: store.getState().setCategory,
    setStatus: store.getState().setStatus,
    setSearchQuery: store.getState().setSearchQuery,
    setPage: store.getState().setPage,
    setPageSize: store.getState().setPageSize,
    resetFilters: store.getState().resetFilters,
  };
}
