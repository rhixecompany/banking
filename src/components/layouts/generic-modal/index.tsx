"use client";

import type { JSX, ReactNode } from "react";

import { useEffect } from "react";

/**
 * Props for the GenericModal component.
 */
export interface GenericModalProps {
  /** Controls modal visibility. */
  open: boolean;
  /** Close handler for the modal. */
  onClose: () => void;
  /** Optional title shown at the top. */
  title?: string;
  /** Modal content. */
  children: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
}

/**
 * GenericModal - Accessible modal dialog with escape handling.
 *
 * @example
 * ```tsx
 * <GenericModal open={open} onClose={() => setOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </GenericModal>
 * ```
 */
export function GenericModal({
  children,
  footer,
  onClose,
  open,
  title,
}: GenericModalProps): JSX.Element | null {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      <div className="w-full max-w-lg rounded-lg bg-card text-card-foreground shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          {title ? (
            <h2 className="text-lg font-semibold">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="border-t px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export default GenericModal;
