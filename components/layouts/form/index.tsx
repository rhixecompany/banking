import React from "react";

import { cn } from "@/lib/utils";

/**
 * Form root component - wraps children in a styled form with error display
 *
 * @export
 * @interface FormProps
 * @typedef {FormProps}
 */
interface FormProps {
  /** Form content */
  children: React.ReactNode;
  /** Form submission handler */
  onSubmit?: (e?: React.FormEvent) => void;
  /** Server-side errors to display */
  errors?: Record<string, string>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Form root component with error display
 *
 * @export
 * @param {FormProps} param0
 * @returns {JSX.Element}
 */
export default function Form({
  children,
  className,
  errors = {},
  onSubmit,
}: FormProps) {
  return (
    <form
      aria-label="form"
      onSubmit={onSubmit}
      className={cn("space-y-4", className)}
    >
      {children}
      {Object.keys(errors).length > 0 && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          {Object.entries(errors).map(([key, message]) => (
            <p role="alert" key={key} className="text-sm text-destructive">
              {message}
            </p>
          ))}
        </div>
      )}
    </form>
  );
}
