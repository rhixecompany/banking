"use client";

import type { JSX } from "react";

/**
 * Toast style variants.
 */
export type GenericToastVariant = "error" | "info" | "success" | "warning";

/**
 * Props for the GenericToast component.
 */
export interface GenericToastProps {
  /** Toast message text. */
  message: string;
  /** Toast variant. */
  type?: GenericToastVariant;
  /** Optional close handler. */
  onClose?: () => void;
}

const variantClasses: Record<GenericToastVariant, string> = {
  error: "border-rose-500/40 bg-rose-500/10 text-rose-700",
  info: "border-blue-500/40 bg-blue-500/10 text-blue-700",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-700",
};

/**
 * GenericToast - Simple toast notification surface.
 *
 * @example
 * ```tsx
 * <GenericToast message="Saved" type="success" onClose={() => setOpen(false)} />
 * ```
 */
export function GenericToast({
  message,
  onClose,
  type = "info",
}: GenericToastProps): JSX.Element {
  return (
    <div
      className={
        "flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm shadow-sm " +
        variantClasses[type]
      }
      role="status"
    >
      <span>{message}</span>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-xs font-medium"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}

export default GenericToast;
