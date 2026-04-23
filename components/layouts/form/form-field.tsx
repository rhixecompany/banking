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
  /** Field name matching form schema */
  name: string;
  /** Field label text */
  label?: string;
  /** Helper description */
  description?: string;
  /** Child input element */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
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
  name,
  label,
  description,
  children,
  className,
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
