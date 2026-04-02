"use client";

import type { ReactNode } from "react";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";

/**
 * Props for DropdownLanguageClientWrapper.
 *
 * @interface DropdownLanguageClientWrapperProps
 */
interface DropdownLanguageClientWrapperProps {
  /** The trigger element that opens the dropdown. */
  trigger: ReactNode;
  /** Whether the dropdown starts open. */
  defaultOpen?: boolean;
  /** Alignment of the dropdown menu. */
  align?: "center" | "end" | "start";
}

/**
 * Client wrapper for the Language Dropdown shadcn-studio block.
 *
 * @export
 * @param {DropdownLanguageClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function DropdownLanguageClientWrapper(
  props: DropdownLanguageClientWrapperProps,
): JSX.Element {
  return <LanguageDropdown {...props} />;
}
