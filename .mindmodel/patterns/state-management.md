# State Management Patterns

## Rules

1. Use Zustand for client state
2. Use `createStore` (not `create`) for SSR safety
3. Define types for state and actions separately
4. Use factory functions for store creation

## Examples

### UI Store with Factory Pattern

```typescript
// src/stores/create-ui-store.ts
import { createStore } from "zustand";

export interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalId;
  drawerOpen: boolean;
}

export interface UIActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
}

export type UIStore = UIActions & UIState;

export const defaultUIState: UIState = {
  activeModal: undefined,
  drawerOpen: false,
  sidebarOpen: false
};

/**
 * Factory function that creates a new UI store instance.
 * Must be called inside a React Context provider.
 */
export function createUIStore(initState: Partial<UIState> = {}) {
  return createStore<UIStore>()(set => ({
    ...defaultUIState,
    ...initState,
    closeModal: () => set({ activeModal: undefined }),
    openModal: id => set({ activeModal: id }),
    setDrawerOpen: open => set({ drawerOpen: open }),
    setSidebarOpen: open => set({ sidebarOpen: open }),
    toggleDrawer: () =>
      set(state => ({ drawerOpen: !state.drawerOpen })),
    toggleSidebar: () =>
      set(state => ({ sidebarOpen: !state.sidebarOpen }))
  }));
}
```

### Store Index with Barrel Exports

```typescript
// src/stores/index.ts
export { createUIStore, defaultUIState } from "./create-ui-store";
export type {
  ModalId,
  UIActions,
  UIState,
  UIStore
} from "./create-ui-store";

export {
  createTransferStore,
  defaultTransferState
} from "./create-transfer-store";
export type {
  TransferActions,
  TransferState,
  TransferStore
} from "./create-transfer-store";

export {
  createFilterStore,
  defaultFilterState
} from "./create-filter-store";
export type {
  FilterActions,
  FilterState,
  FilterStore
} from "./create-filter-store";

export {
  createToastStore,
  defaultToastState
} from "./create-toast-store";
export type {
  ToastActions,
  ToastState,
  ToastStore
} from "./create-toast-store";
```

## Anti-patterns

### ❌ Direct create() Usage (Breaks SSR)

```typescript
// BAD - causes hydration mismatch
export const useUIStore = create(set => ({
  sidebarOpen: false
  // ...
}));
```

### ✅ Factory with createStore (SSR Safe)

```typescript
// GOOD - SSR safe
export function createUIStore(initState = {}) {
  return createStore<UIStore>()(set => ({
    // ...
  }));
}
```
