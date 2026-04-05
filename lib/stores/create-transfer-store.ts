/**
 * Transfer Wizard Store — manages multi-step ACH transfer form state.
 * Steps: 0=select-banks, 1=enter-amount, 2=review, 3=processing, 4=result
 * Uses createStore for SSR-safe React Context initialization.
 */

import { createStore } from "zustand";

/** All wizard steps, in order. */
export type TransferStep =
  | "enter-amount"
  | "processing"
  | "result"
  | "review"
  | "select-banks";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @typedef {TransferStatus}
 */
export type TransferStatus = "error" | "idle" | "pending" | "success";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface TransferFormData
 * @typedef {TransferFormData}
 */
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface TransferState
 * @typedef {TransferState}
 */
export interface TransferState {
  /** Current wizard step. */
  currentStep: TransferStep;
  /** Accumulated form data across steps. */
  formData: TransferFormData;
  /** Processing/result status. */
  status: TransferStatus;
  /** Error message if status is "error". */
  errorMessage: string | undefined;
  /** Transfer URL returned by Dwolla on success. */
  transferUrl: string | undefined;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface TransferActions
 * @typedef {TransferActions}
 */
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @typedef {TransferStore}
 */
export type TransferStore = TransferActions & TransferState;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {TransferStep[]}
 */
const STEPS: TransferStep[] = [
  "select-banks",
  "enter-amount",
  "review",
  "processing",
  "result",
];

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {TransferFormData}
 */
const defaultFormData: TransferFormData = {
  amount: "",
  note: "",
  receiverBankId: "",
  senderBankId: "",
};

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {TransferState}
 */
export const defaultTransferState: TransferState = {
  currentStep: "select-banks",
  errorMessage: undefined,
  formData: defaultFormData,
  status: "idle",
  transferUrl: undefined,
};

/**
 * Factory function that creates a new Transfer Wizard store instance.
 * Must be called inside a React Context provider to prevent SSR data leakage.
 */
export function createTransferStore(initState: Partial<TransferState> = {}) {
  return createStore<TransferStore>()((set, get) => ({
    ...defaultTransferState,
    ...initState,

    goToStep: (step) => set({ currentStep: step }),

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

    reset: () =>
      set({
        ...defaultTransferState,
        formData: { ...defaultFormData },
      }),

    setError: (message) => set({ errorMessage: message, status: "error" }),

    setStatus: (status) => set({ status }),

    setTransferUrl: (url) => set({ status: "success", transferUrl: url }),

    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
  }));
}
