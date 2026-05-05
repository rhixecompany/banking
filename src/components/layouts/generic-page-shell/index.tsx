import type { JSX, ReactNode } from "react";

/**
 * Props for the GenericPageShell component.
 */
export interface GenericPageShellProps {
  /** Page title (h1). */
  title: string;
  /** Optional description below the title. */
  description?: string;
  /** Main content for the page. */
  children: ReactNode;
  /** Optional actions shown next to the title. */
  actions?: ReactNode;
  /** Optional loading state that dims content. */
  loading?: boolean;
  /** Additional CSS classes for the shell. */
  className?: string;
}

/**
 * GenericPageShell - A simple page layout wrapper with title, description,
 * and optional actions.
 *
 * @example
 * ```tsx
 * <GenericPageShell
 *   title="Dashboard"
 *   description="Your financial overview"
 *   actions={<Button>Add Account</Button>}
 * >
 *   <DashboardContent />
 * </GenericPageShell>
 * ```
 */
export function GenericPageShell({
  actions,
  children,
  className,
  description,
  loading,
  title,
}: GenericPageShellProps): JSX.Element {
  return (
    <section className={className}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
      <div className={loading ? "mt-6 opacity-60" : "mt-6"}>{children}</div>
    </section>
  );
}

export default GenericPageShell;
