"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

/**
 * FormField props for reusable field component
 *
 * @interface FormFieldProps
 * @typedef {FormFieldProps}
 */
interface FormFieldProps {
  /** Additional CSS classes */
  className?: string;
  /** Child input element */
  children: React.ReactNode;
  /** Helper description */
  description?: string;
  /** Field label text */
  label?: string;
  /** Field name matching form schema */
  name: string;
}

/**
 * Reusable form field wrapper using react-hook-form + shadcn/ui
 * Extracts field state from context and renders label, description, control, and error
 *
 * @export
 * @param {FormFieldProps} param0
 * @returns {JSX.Element}
 */
export function FormField({
  children,
  className,
  description,
  label,
  name,
}: FormFieldProps) {
  const { control } = useFormContext();

  return (
    <FormItem className={cn("space-y-2", className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
