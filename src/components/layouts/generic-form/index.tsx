"use client";

import type { JSX, ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

/**
 * Props for the GenericForm component.
 */
export interface GenericFormProps<T extends FieldValues> {
  /** React Hook Form instance. */
  form: UseFormReturn<T>;
  /** Submit handler called with validated form data. */
  onSubmit: (data: T) => Promise<void> | void;
  /** Form content. */
  children: ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * GenericForm - A thin wrapper around react-hook-form.
 *
 * @example
 * ```tsx
 * <GenericForm form={form} onSubmit={handleSubmit}>
 *   <FormFields />
 * </GenericForm>
 * ```
 */
export function GenericForm<T extends FieldValues>({
  children,
  className,
  form,
  onSubmit,
}: GenericFormProps<T>): JSX.Element {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit(onSubmit)(event);
      }}
    >
      {children}
    </form>
  );
}

export default GenericForm;
