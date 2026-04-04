import { describe, expect, it } from "vitest";

import {
  type ToastActions,
  createToastStore,
  defaultToastState,
} from "@/lib/stores/create-toast-store";

describe("createToastStore", () => {
  it("initialises with an empty toast queue", () => {
    const store = createToastStore();
    expect(store.getState().toasts).toEqual(defaultToastState.toasts);
    expect(store.getState().toasts).toHaveLength(0);
  });

  it("accepts partial initial state override", () => {
    const existing = [
      { id: "t1", message: "Hello", type: "info" as const, duration: 4000 },
    ];
    const store = createToastStore({ toasts: existing });
    expect(store.getState().toasts).toHaveLength(1);
  });

  describe("addToast", () => {
    it("appends a toast with an auto-generated ID", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ message: "Saved!", type: "success", duration: 3000 });
      const { toasts } = store.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("Saved!");
      expect(toasts[0].type).toBe("success");
      expect(toasts[0].duration).toBe(3000);
      expect(typeof toasts[0].id).toBe("string");
      expect(toasts[0].id.length).toBeGreaterThan(0);
    });

    it("uses the provided ID when supplied", () => {
      const store = createToastStore();
      store.getState().addToast({
        id: "custom-id",
        message: "Done",
        type: "info",
        duration: 4000,
      });
      expect(store.getState().toasts[0].id).toBe("custom-id");
    });

    it("defaults duration to 4000 when not provided", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ message: "Hey", type: "warning" } as Parameters<
          ToastActions["addToast"]
        >[0]);
      expect(store.getState().toasts[0].duration).toBe(4000);
    });

    it("appends multiple toasts in order", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ message: "First", type: "info", duration: 4000 });
      store
        .getState()
        .addToast({ message: "Second", type: "error", duration: 5000 });
      const { toasts } = store.getState();
      expect(toasts).toHaveLength(2);
      expect(toasts[0].message).toBe("First");
      expect(toasts[1].message).toBe("Second");
    });
  });

  describe("removeToast", () => {
    it("removes the toast with the matching ID", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ id: "t1", message: "A", type: "success", duration: 4000 });
      store
        .getState()
        .addToast({ id: "t2", message: "B", type: "error", duration: 4000 });
      store.getState().removeToast("t1");
      const { toasts } = store.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].id).toBe("t2");
    });

    it("is a no-op when the ID does not exist", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ id: "t1", message: "A", type: "info", duration: 4000 });
      store.getState().removeToast("nonexistent");
      expect(store.getState().toasts).toHaveLength(1);
    });
  });

  describe("clearToasts", () => {
    it("empties the entire toast queue", () => {
      const store = createToastStore();
      store
        .getState()
        .addToast({ message: "One", type: "success", duration: 4000 });
      store
        .getState()
        .addToast({ message: "Two", type: "info", duration: 4000 });
      store.getState().clearToasts();
      expect(store.getState().toasts).toHaveLength(0);
    });

    it("is safe to call on an already-empty queue", () => {
      const store = createToastStore();
      store.getState().clearToasts();
      expect(store.getState().toasts).toHaveLength(0);
    });
  });
});
