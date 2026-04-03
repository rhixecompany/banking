/**
 * UI Store — controls sidebar open/closed state, active modal ID, and drawer state.
 * Uses createStore (not create) for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

/** Supported modal identifiers. Extend as new modals are added. */
export type ModalId =
  | "connect-bank"
  | "disconnect-bank"
  | "confirm-transfer"
  | null;

export interface UIState {
  /** Whether the sidebar is open (used on mobile / collapsed desktop). */
  sidebarOpen: boolean;
  /** The currently active modal ID, or null if none is open. */
  activeModal: ModalId;
  /** Whether the mobile drawer is open. */
  drawerOpen: boolean;
}

export interface UIActions {
  /** Open or close the sidebar. */
  setSidebarOpen: (open: boolean) => void;
  /** Toggle the sidebar open/closed. */
  toggleSidebar: () => void;
  /** Open a specific modal by ID. */
  openModal: (id: ModalId) => void;
  /** Close the currently active modal. */
  closeModal: () => void;
  /** Open or close the mobile drawer. */
  setDrawerOpen: (open: boolean) => void;
  /** Toggle the mobile drawer. */
  toggleDrawer: () => void;
}

export type UIStore = UIState & UIActions;

export const defaultUIState: UIState = {
  sidebarOpen: false,
  activeModal: null,
  drawerOpen: false,
};

/**
 * Factory function that creates a new UI store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createUIStore(initState: Partial<UIState> = {}) {
  return createStore<UIStore>()((set) => ({
    ...defaultUIState,
    ...initState,

    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),

    setDrawerOpen: (open) => set({ drawerOpen: open }),
    toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  }));
}
