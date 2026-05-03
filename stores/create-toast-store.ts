/**
 * Toast Queue Store — manages a queue of toast notifications.
 * The Toaster UI component (sonner) handles display; this store drives it
 * programmatically from non-component contexts (e.g., Server Action callbacks).
 * Uses createStore for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

export type ToastType = "error" | "info" | "success" | "warning";

export interface ToastItem {
  /** Unique identifier for deduplication and dismissal. */
  id: string;
  /** Human-readable message text. */
  message: string;
  /** Visual style variant. */
  type: ToastType;
  /** Duration in milliseconds before auto-dismiss. Default: 4000. */
  duration: number;
}

export interface ToastState {
  /** Ordered queue of pending/active toasts. */
  toasts: ToastItem[];
}

export interface ToastActions {
  /**
   * Add a new toast to the queue.
   * Auto-generates an ID if not provided.
   */
  addToast: (toast: { id?: string } & Omit<ToastItem, "id">) => void;
  /** Remove a toast from the queue by ID. */
  removeToast: (id: string) => void;
  /** Clear all toasts from the queue. */
  clearToasts: () => void;
}

export type ToastStore = ToastActions & ToastState;

export const defaultToastState: ToastState = {
  toasts: [],
};

/** Generate a simple unique ID for toasts. */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Factory function that creates a new Toast Queue store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createToastStore(initState: Partial<ToastState> = {}) {
  return createStore<ToastStore>()((set) => ({
    ...defaultToastState,
    ...initState,

    addToast: (toast) =>
      set((state) => ({
        toasts: [
          ...state.toasts,
          {
            duration: toast.duration ?? 4000,
            id: toast.id ?? generateId(),
            message: toast.message,
            type: toast.type,
          },
        ],
      })),

    clearToasts: () => set({ toasts: [] }),

    removeToast: (id) =>
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
  }));
}
