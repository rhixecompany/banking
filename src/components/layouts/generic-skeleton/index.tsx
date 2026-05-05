import type { CSSProperties, JSX } from "react";

/**
 * Skeleton variants for common shapes.
 */
export type GenericSkeletonVariant = "circular" | "rectangular" | "text";

/**
 * Props for the GenericSkeleton component.
 */
export interface GenericSkeletonProps {
  /** Width of the skeleton (px, %, etc). */
  width?: number | string;
  /** Height of the skeleton (px, %, etc). */
  height?: number | string;
  /** Visual shape variant. */
  variant?: GenericSkeletonVariant;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * GenericSkeleton - Loading placeholder block.
 *
 * @example
 * ```tsx
 * <GenericSkeleton width={160} height={20} />
 * ```
 */
export function GenericSkeleton({
  className,
  height,
  variant = "text",
  width,
}: GenericSkeletonProps): JSX.Element {
  const style: CSSProperties = {
    height: height ?? (variant === "text" ? 16 : undefined),
    width: width ?? (variant === "text" ? "100%" : undefined),
  };

  const roundedClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "rectangular"
        ? "rounded-lg"
        : "rounded";

  return (
    <div
      className={
        "animate-pulse bg-muted " + roundedClass + " " + (className ?? "")
      }
      style={style}
      aria-hidden="true"
    />
  );
}

export default GenericSkeleton;
