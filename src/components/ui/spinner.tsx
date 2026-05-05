import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"svg">} param0
 * @param {React.ComponentProps<"svg">} param0.className
 * @param {React.ComponentProps<"svg">} param0....props
 * @returns {ReactJSX.Element}
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

// Provide both Spinner and LoadingSpinner named exports for compatibility
export { Spinner };
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {({ className, ...props }: React.ComponentProps<"svg">) => ReactJSX.Element}
 */
export const LoadingSpinner = Spinner;
