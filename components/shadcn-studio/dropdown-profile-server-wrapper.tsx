import type { ReactNode } from "react";

import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";

/**
 * Props for DropdownProfileServerWrapper.
 *
 * @interface DropdownProfileServerWrapperProps
 */
interface DropdownProfileServerWrapperProps {
  /** The trigger element that opens the dropdown. */
  trigger: ReactNode;
  /** User display name. */
  name: string;
  /** User email address. */
  email: string;
  /** Optional user avatar URL. */
  image?: null | string;
  /** Whether the dropdown starts open. */
  defaultOpen?: boolean;
  /** Alignment of the dropdown menu. */
  align?: "center" | "end" | "start";
}

/**
 * Server wrapper for the Profile Dropdown shadcn-studio block.
 *
 * @export
 * @param {DropdownProfileServerWrapperProps} props
 * @returns {JSX.Element}
 */
export function DropdownProfileServerWrapper(
  props: DropdownProfileServerWrapperProps,
): JSX.Element {
  return <ProfileDropdown {...props} />;
}
