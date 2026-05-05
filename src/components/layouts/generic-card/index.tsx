import type { JSX, ReactNode } from "react";

/**
 * Props for the GenericCard component.
 */
export interface GenericCardProps {
  /** Optional header content. */
  header?: ReactNode;
  /** Main content of the card. */
  children: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * GenericCard - A flexible card wrapper with header and footer slots.
 *
 * @example
 * ```tsx
 * <GenericCard header={<h3>Balance</h3>} footer={<Button>View</Button>}>
 *   <BalanceSummary />
 * </GenericCard>
 * ```
 */
export function GenericCard({
  children,
  className,
  footer,
  header,
}: GenericCardProps): JSX.Element {
  return (
    <section
      className={
        "rounded-lg border bg-card text-card-foreground " + (className ?? "")
      }
    >
      {header ? (
        <header className="border-b px-5 py-4 text-sm font-semibold">
          {header}
        </header>
      ) : null}
      <div className="px-5 py-4">{children}</div>
      {footer ? <footer className="border-t px-5 py-3">{footer}</footer> : null}
    </section>
  );
}

export default GenericCard;
