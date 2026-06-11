import type { JSX, ReactNode } from "react";

/**
 * Props for the PageContainer component.
 */
export interface PageContainerProps {
  /** Page title (h1) */
  title: string;
  /** Optional description text below title */
  description?: string;
  /** Child content */
  children: ReactNode;
  /** Optional right-side content (actions, buttons) */
  actions?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** CSS grid columns pattern (default: "grid-cols-1 lg:grid-cols-3") */
  columns?: string;
  /** Gap spacing class (default: "gap-6") */
  gap?: string;
}

/**
 * PageContainer - A reusable page layout wrapper.
 *
 * Common wrapper for protected pages with consistent:
 * - Header (title + description)
 * - Optional actions slot
 * - Main content area with grid
 *
 * Follows Law 1 (Early Exit) - Simple component, no edge cases.
 * Follows Law 5 (Intentional Naming) - Self-documenting props.
 *
 * @example
 * ```tsx
 * <PageContainer
 *   title="Dashboard"
 *   description="Your financial overview"
 *   actions={<Button>Add Account</Button>}
 * >
 *   <Card>Content</Card>
 * </PageContainer>
 * ```
 *
 * @param props - Component props
 * @returns Rendered page container
 */
export function PageContainer({
  actions,
  children,
  className,
  columns = "grid-cols-1 lg:grid-cols-3",
  description,
  gap = "gap-6",
  title,
}: PageContainerProps): JSX.Element {
  return (
    <section
      className={["grid", gap, columns, className].filter(Boolean).join(" ")}
    >
      {/* Header spanning full width */}
      <div className="col-span-full mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Content - preserves children layout */}
      <div className="col-span-full">{children}</div>
    </section>
  );
}

export default PageContainer;
