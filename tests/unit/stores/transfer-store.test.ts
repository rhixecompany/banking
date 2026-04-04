import { describe, expect, it } from "vitest";

import {
  createTransferStore,
  defaultTransferState,
} from "@/lib/stores/create-transfer-store";

describe("createTransferStore", () => {
  it("initialises with default state", () => {
    const store = createTransferStore();
    const state = store.getState();
    expect(state.currentStep).toBe(defaultTransferState.currentStep);
    expect(state.status).toBe(defaultTransferState.status);
    expect(state.errorMessage).toBeNull();
    expect(state.transferUrl).toBeNull();
    expect(state.formData).toEqual(defaultTransferState.formData);
  });

  it("accepts partial initial state override", () => {
    const store = createTransferStore({ currentStep: "review" });
    expect(store.getState().currentStep).toBe("review");
  });

  describe("nextStep", () => {
    it("advances from select-banks to enter-amount", () => {
      const store = createTransferStore();
      store.getState().nextStep();
      expect(store.getState().currentStep).toBe("enter-amount");
    });

    it("advances through all steps in order", () => {
      const store = createTransferStore();
      const expectedOrder = [
        "enter-amount",
        "review",
        "processing",
        "result",
      ] as const;
      for (const step of expectedOrder) {
        store.getState().nextStep();
        expect(store.getState().currentStep).toBe(step);
      }
    });

    it("does not advance past the last step", () => {
      const store = createTransferStore({ currentStep: "result" });
      store.getState().nextStep();
      expect(store.getState().currentStep).toBe("result");
    });
  });

  describe("prevStep", () => {
    it("goes back from enter-amount to select-banks", () => {
      const store = createTransferStore({ currentStep: "enter-amount" });
      store.getState().prevStep();
      expect(store.getState().currentStep).toBe("select-banks");
    });

    it("does not go before the first step", () => {
      const store = createTransferStore();
      store.getState().prevStep();
      expect(store.getState().currentStep).toBe("select-banks");
    });
  });

  describe("goToStep", () => {
    it("jumps directly to a given step", () => {
      const store = createTransferStore();
      store.getState().goToStep("processing");
      expect(store.getState().currentStep).toBe("processing");
    });
  });

  describe("updateFormData", () => {
    it("merges partial form data", () => {
      const store = createTransferStore();
      store
        .getState()
        .updateFormData({ amount: "100", senderBankId: "bank-1" });
      const { formData } = store.getState();
      expect(formData.amount).toBe("100");
      expect(formData.senderBankId).toBe("bank-1");
      expect(formData.receiverBankId).toBe("");
      expect(formData.note).toBe("");
    });

    it("overwrites only the provided fields on successive updates", () => {
      const store = createTransferStore();
      store.getState().updateFormData({ amount: "50" });
      store.getState().updateFormData({ note: "rent" });
      expect(store.getState().formData.amount).toBe("50");
      expect(store.getState().formData.note).toBe("rent");
    });
  });

  describe("setStatus", () => {
    it("sets status to pending", () => {
      const store = createTransferStore();
      store.getState().setStatus("pending");
      expect(store.getState().status).toBe("pending");
    });
  });

  describe("setError", () => {
    it("sets status to error and stores message", () => {
      const store = createTransferStore();
      store.getState().setError("Insufficient funds");
      expect(store.getState().status).toBe("error");
      expect(store.getState().errorMessage).toBe("Insufficient funds");
    });
  });

  describe("setTransferUrl", () => {
    it("sets transferUrl and status to success", () => {
      const store = createTransferStore();
      store.getState().setTransferUrl("https://api.dwolla.com/transfers/abc");
      expect(store.getState().transferUrl).toBe(
        "https://api.dwolla.com/transfers/abc",
      );
      expect(store.getState().status).toBe("success");
    });
  });

  describe("reset", () => {
    it("resets the store back to default state", () => {
      const store = createTransferStore();
      store.getState().goToStep("result");
      store.getState().updateFormData({ amount: "200", senderBankId: "s1" });
      store.getState().setError("oops");
      store.getState().reset();
      const state = store.getState();
      expect(state.currentStep).toBe("select-banks");
      expect(state.formData).toEqual(defaultTransferState.formData);
      expect(state.status).toBe("idle");
      expect(state.errorMessage).toBeNull();
      expect(state.transferUrl).toBeNull();
    });
  });
});
