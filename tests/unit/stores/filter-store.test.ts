import { describe, expect, it } from "vitest";

import {
  createFilterStore,
  defaultFilterState,
} from "@/lib/stores/create-filter-store";

describe("createFilterStore", () => {
  it("initialises with default state", () => {
    const store = createFilterStore();
    const state = store.getState();
    expect(state.dateRange).toEqual({ from: undefined, to: undefined });
    expect(state.category).toBe("");
    expect(state.searchQuery).toBe("");
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(20);
  });

  it("accepts partial initial state override", () => {
    const store = createFilterStore({ page: 3, pageSize: 10 });
    expect(store.getState().page).toBe(3);
    expect(store.getState().pageSize).toBe(10);
    expect(store.getState().category).toBe("");
  });

  describe("setDateRange", () => {
    it("applies the date range and resets page to 1", () => {
      const store = createFilterStore({ page: 4 });
      store.getState().setDateRange({ from: "2024-01-01", to: "2024-12-31" });
      expect(store.getState().dateRange).toEqual({
        from: "2024-01-01",
        to: "2024-12-31",
      });
      expect(store.getState().page).toBe(1);
    });

    it("clears the date range when undefined is passed", () => {
      const store = createFilterStore();
      store.getState().setDateRange({ from: "2024-01-01", to: "2024-03-31" });
      store.getState().setDateRange({ from: undefined, to: undefined });
      expect(store.getState().dateRange).toEqual({
        from: undefined,
        to: undefined,
      });
    });
  });

  describe("setCategory", () => {
    it("sets the category and resets page to 1", () => {
      const store = createFilterStore({ page: 2 });
      store.getState().setCategory("Food");
      expect(store.getState().category).toBe("Food");
      expect(store.getState().page).toBe(1);
    });

    it("clears the category when empty string is passed", () => {
      const store = createFilterStore();
      store.getState().setCategory("Travel");
      store.getState().setCategory("");
      expect(store.getState().category).toBe("");
    });
  });

  describe("setSearchQuery", () => {
    it("sets the search query and resets page to 1", () => {
      const store = createFilterStore({ page: 5 });
      store.getState().setSearchQuery("amazon");
      expect(store.getState().searchQuery).toBe("amazon");
      expect(store.getState().page).toBe(1);
    });
  });

  describe("setPage", () => {
    it("updates the current page without resetting filters", () => {
      const store = createFilterStore();
      store.getState().setCategory("Food");
      store.getState().setPage(3);
      expect(store.getState().page).toBe(3);
      expect(store.getState().category).toBe("Food");
    });
  });

  describe("setPageSize", () => {
    it("sets the page size and resets page to 1", () => {
      const store = createFilterStore({ page: 4 });
      store.getState().setPageSize(50);
      expect(store.getState().pageSize).toBe(50);
      expect(store.getState().page).toBe(1);
    });
  });

  describe("resetFilters", () => {
    it("restores all filters to their defaults", () => {
      const store = createFilterStore();
      store.getState().setDateRange({ from: "2024-01-01", to: "2024-06-30" });
      store.getState().setCategory("Bills");
      store.getState().setSearchQuery("netflix");
      store.getState().setPage(7);
      store.getState().setPageSize(50);
      store.getState().resetFilters();
      const state = store.getState();
      expect(state).toMatchObject(defaultFilterState);
    });
  });
});
