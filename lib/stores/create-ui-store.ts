/**
 * UI Store — controls sidebar open/closed state, active modal ID, and drawer state.
 * Uses createStore (not create) for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

/** Supported modal identifiers. Extend as new modals are added. */
export type ModalId =
  | "confirm-transfer"
  | "connect-bank"
  | "disconnect-bank"
  | undefined;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface UIState
 * @typedef {UIState}
 */
export interface UIState {
  /** Whether the sidebar is open (used on mobile / collapsed desktop). */
  sidebarOpen: boolean;
  /** The currently active modal ID, or null if none is open. */
  activeModal: ModalId;
  /** Whether the mobile drawer is open. */
  drawerOpen: boolean;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface UIActions
 * @typedef {UIActions}
 */
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @typedef {UIStore}
 */
export type UIStore = UIActions & UIState;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {UIState}
 */
export const defaultUIState: UIState = {
  activeModal: undefined,
  drawerOpen: false,
  sidebarOpen: false,
};

/**
 * Factory function that creates a new UI store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createUIStore(initState: Partial<UIState> = {}) {
  return createStore<UIStore>()((set) => ({
    ...defaultUIState,
    ...initState,

    closeModal: () => set({ activeModal: undefined }),
    openModal: (id) => set({ activeModal: id }),

    setDrawerOpen: (open) => set({ drawerOpen: open }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  }));
}
