"use client";

import type { ReactNode } from "react";

import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";

/**
 * Props for DropdownProfileClientWrapper.
 *
 * @interface DropdownProfileClientWrapperProps
 */
interface DropdownProfileClientWrapperProps {
  /** The trigger element that opens the dropdown. */
  trigger: ReactNode;
  /** Whether the dropdown starts open. */
  defaultOpen?: boolean;
  /** Alignment of the dropdown menu. */
  align?: "center" | "end" | "start";
}

/**
 * Client wrapper for the Profile Dropdown shadcn-studio block.
 *
 * @export
 * @param {DropdownProfileClientWrapperProps} props
 * @returns {JSX.Element}
 */
export function DropdownProfileClientWrapper(
  props: DropdownProfileClientWrapperProps,
): JSX.Element {
  return <ProfileDropdown {...props} />;
}
