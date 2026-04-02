import type { ReactNode } from "react";

import LanguageDropdown from "@/components/shadcn-studio/blocks/dropdown-language";

/**
 * Props for DropdownLanguageServerWrapper.
 *
 * @interface DropdownLanguageServerWrapperProps
 */
interface DropdownLanguageServerWrapperProps {
  /** The trigger element that opens the dropdown. */
  trigger: ReactNode;
  /** Whether the dropdown starts open. */
  defaultOpen?: boolean;
  /** Alignment of the dropdown menu. */
  align?: "center" | "end" | "start";
}

/**
 * Server wrapper for the Language Dropdown shadcn-studio block.
 *
 * @export
 * @param {DropdownLanguageServerWrapperProps} props
 * @returns {JSX.Element}
 */
export function DropdownLanguageServerWrapper(
  props: DropdownLanguageServerWrapperProps,
): JSX.Element {
  return <LanguageDropdown {...props} />;
}
