import type { JSX, ReactNode } from "react";

/**
 * Props for the GenericEmptyState component.
 */
export interface GenericEmptyStateProps {
  /** Optional icon or illustration. */
  icon?: ReactNode;
  /** Primary title text. */
  title: string;
  /** Optional descriptive text. */
  description?: string;
  /** Optional action element (button, link). */
  action?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * GenericEmptyState - Display when there is no data.
 *
 * @example
 * ```tsx
 * <GenericEmptyState
 *   title="No transactions"
 *   description="Create a transfer to see activity here."
 *   action={<Button>Create transfer</Button>}
 * />
 * ```
 */
export function GenericEmptyState({
  action,
  className,
  description,
  icon,
  title,
}: GenericEmptyStateProps): JSX.Element {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-3 rounded-lg border bg-card px-6 py-10 text-center " +
        (className ?? "")
      }
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

export default GenericEmptyState;
