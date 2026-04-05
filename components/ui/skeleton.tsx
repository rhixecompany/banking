import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} param0
 * @param {React.HTMLAttributes<HTMLDivElement>} param0.className
 * @param {React.HTMLAttributes<HTMLDivElement>} param0....props
 * @returns {ReactJSX.Element}
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
