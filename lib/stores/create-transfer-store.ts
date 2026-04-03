/**
 * Transfer Wizard Store — manages multi-step ACH transfer form state.
 * Steps: 0=select-banks, 1=enter-amount, 2=review, 3=processing, 4=result
 * Uses createStore for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

/** All wizard steps, in order. */
export type TransferStep =
  | "select-banks"
  | "enter-amount"
  | "review"
  | "processing"
  | "result";

export type TransferStatus = "idle" | "pending" | "success" | "error";

export interface TransferFormData {
  /** Sender's bank record ID (from banks table). */
  senderBankId: string;
  /** Receiver's bank sharableId or record ID. */
  receiverBankId: string;
  /** Transfer amount as a string (mirrors numeric DB field). */
  amount: string;
  /** Optional note/memo visible to receiver. */
  note: string;
}

export interface TransferState {
  /** Current wizard step. */
  currentStep: TransferStep;
  /** Accumulated form data across steps. */
  formData: TransferFormData;
  /** Processing/result status. */
  status: TransferStatus;
  /** Error message if status is "error". */
  errorMessage: string | null;
  /** Transfer URL returned by Dwolla on success. */
  transferUrl: string | null;
}

export interface TransferActions {
  /** Advance to the next step. */
  nextStep: () => void;
  /** Go back to the previous step. */
  prevStep: () => void;
  /** Jump directly to a step. */
  goToStep: (step: TransferStep) => void;
  /** Update form data fields (partial merge). */
  updateFormData: (data: Partial<TransferFormData>) => void;
  /** Set processing status. */
  setStatus: (status: TransferStatus) => void;
  /** Set an error message. */
  setError: (message: string) => void;
  /** Set the successful transfer URL. */
  setTransferUrl: (url: string) => void;
  /** Reset the entire wizard to initial state. */
  reset: () => void;
}

export type TransferStore = TransferState & TransferActions;

const STEPS: TransferStep[] = [
  "select-banks",
  "enter-amount",
  "review",
  "processing",
  "result",
];

const defaultFormData: TransferFormData = {
  senderBankId: "",
  receiverBankId: "",
  amount: "",
  note: "",
};

export const defaultTransferState: TransferState = {
  currentStep: "select-banks",
  formData: defaultFormData,
  status: "idle",
  errorMessage: null,
  transferUrl: null,
};

/**
 * Factory function that creates a new Transfer Wizard store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createTransferStore(initState: Partial<TransferState> = {}) {
  return createStore<TransferStore>()((set, get) => ({
    ...defaultTransferState,
    ...initState,

    nextStep: () => {
      const current = get().currentStep;
      const idx = STEPS.indexOf(current);
      if (idx < STEPS.length - 1) {
        set({ currentStep: STEPS[idx + 1] });
      }
    },

    prevStep: () => {
      const current = get().currentStep;
      const idx = STEPS.indexOf(current);
      if (idx > 0) {
        set({ currentStep: STEPS[idx - 1] });
      }
    },

    goToStep: (step) => set({ currentStep: step }),

    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),

    setStatus: (status) => set({ status }),

    setError: (message) => set({ status: "error", errorMessage: message }),

    setTransferUrl: (url) => set({ transferUrl: url, status: "success" }),

    reset: () =>
      set({
        ...defaultTransferState,
        formData: { ...defaultFormData },
      }),
  }));
}
