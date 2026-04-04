import { describe, expect, it } from "vitest";

import { createUIStore, defaultUIState } from "@/lib/stores/create-ui-store";

describe("createUIStore", () => {
  it("initialises with default state", () => {
    const store = createUIStore();
    const state = store.getState();
    expect(state.sidebarOpen).toBe(defaultUIState.sidebarOpen);
    expect(state.activeModal).toBe(defaultUIState.activeModal);
    expect(state.drawerOpen).toBe(defaultUIState.drawerOpen);
  });

  it("accepts partial initial state override", () => {
    const store = createUIStore({ sidebarOpen: true });
    expect(store.getState().sidebarOpen).toBe(true);
    expect(store.getState().drawerOpen).toBe(false);
  });

  describe("setSidebarOpen", () => {
    it("sets sidebar open to true", () => {
      const store = createUIStore();
      store.getState().setSidebarOpen(true);
      expect(store.getState().sidebarOpen).toBe(true);
    });

    it("sets sidebar open to false", () => {
      const store = createUIStore({ sidebarOpen: true });
      store.getState().setSidebarOpen(false);
      expect(store.getState().sidebarOpen).toBe(false);
    });
  });

  describe("toggleSidebar", () => {
    it("toggles sidebar from false to true", () => {
      const store = createUIStore();
      store.getState().toggleSidebar();
      expect(store.getState().sidebarOpen).toBe(true);
    });

    it("toggles sidebar from true to false", () => {
      const store = createUIStore({ sidebarOpen: true });
      store.getState().toggleSidebar();
      expect(store.getState().sidebarOpen).toBe(false);
    });
  });

  describe("openModal / closeModal", () => {
    it("opens a modal by ID", () => {
      const store = createUIStore();
      store.getState().openModal("connect-bank");
      expect(store.getState().activeModal).toBe("connect-bank");
    });

    it("closes the active modal", () => {
      const store = createUIStore();
      store.getState().openModal("disconnect-bank");
      store.getState().closeModal();
      expect(store.getState().activeModal).toBeUndefined();
    });

    it("switches between modal IDs", () => {
      const store = createUIStore();
      store.getState().openModal("connect-bank");
      store.getState().openModal("confirm-transfer");
      expect(store.getState().activeModal).toBe("confirm-transfer");
    });
  });

  describe("setDrawerOpen", () => {
    it("opens the drawer", () => {
      const store = createUIStore();
      store.getState().setDrawerOpen(true);
      expect(store.getState().drawerOpen).toBe(true);
    });

    it("closes the drawer", () => {
      const store = createUIStore({ drawerOpen: true });
      store.getState().setDrawerOpen(false);
      expect(store.getState().drawerOpen).toBe(false);
    });
  });

  describe("toggleDrawer", () => {
    it("toggles drawer from false to true", () => {
      const store = createUIStore();
      store.getState().toggleDrawer();
      expect(store.getState().drawerOpen).toBe(true);
    });

    it("toggles drawer from true to false", () => {
      const store = createUIStore({ drawerOpen: true });
      store.getState().toggleDrawer();
      expect(store.getState().drawerOpen).toBe(false);
    });
  });
});
