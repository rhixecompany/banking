import type { JSX, ReactNode } from "react";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
  /** Section title (h2) */
  title: string;
  /** Optional description text below title */
  description?: string;
  /** Optional right-side content (actions, buttons) */
  actions?: ReactNode;
  /** Heading level - default h2 */
  as?: "h2" | "h3" | "h4";
  /** Additional CSS classes */
  className?: string;
}

/**
 * SectionHeader - A reusable section header component.
 *
 * Common header for content sections with consistent:
 * - Title (h2/h3/h4)
 * - Optional description
 * - Optional actions slot
 *
 * Follows Law 1 (Early Exit) - Simple component, no edge cases.
 * Follows Law 5 (Intentional Naming) - Self-documenting props.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Recent Transactions"
 *   description="Your latest activity"
 *   actions={
 *     <Button variant="outline">View All</Button>
 *   }
 * />
 * ```
 *
 * @param props - Component props
 * @returns Rendered section header
 */
export function SectionHeader({
  actions,
  as: HeadingTag = "h2",
  className,
  description,
  title,
}: SectionHeaderProps): JSX.Element {
  return (
    <div
      className={[
        "mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-1">
        <HeadingTag className="text-xl font-semibold tracking-tight">
          {title}
        </HeadingTag>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export default SectionHeader;
