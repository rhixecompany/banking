import type { ReactNode } from "react";

import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @export
 * @param {{
 *   isLoading: boolean
 *   children: ReactNode
 *   className?: string
 * }} param0
 * @param {boolean} param0.isLoading
 * @param {ReactNode} param0.children
 * @param {string} param0.className
 * @returns {*}
 */
export function LoadingSwap({
  children,
  className,
  isLoading,
}: {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-1 place-items-center ">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 w-full",
          isLoading ? "invisible" : "visible",
          className,
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "visible" : "invisible",
          className,
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
}
