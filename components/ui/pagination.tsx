import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";

import { buttonVariants, type Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"nav">} param0
 * @param {React.ComponentProps<"nav">} param0.className
 * @param {React.ComponentProps<"nav">} param0....props
 * @returns {ReactJSX.Element}
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"ul">} param0
 * @param {React.ComponentProps<"ul">} param0.className
 * @param {React.ComponentProps<"ul">} param0....props
 * @returns {ReactJSX.Element}
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"li">} param0
 * @param {React.ComponentProps<"li">} param0....props
 * @returns {ReactJSX.Element}
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {PaginationLinkProps}
 */
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({ children?: React.ReactNode } & PaginationLinkProps)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0.isActive
 * @param {*} [param0.size="icon"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function PaginationLink({
  children,
  className,
  isActive,
  size = "icon",
  ...props
}: { children?: React.ReactNode } & PaginationLinkProps) {
  const ariaLabel = (props as any)["aria-label"] as string | undefined;
  const fallback = ariaLabel ?? (isActive ? "Current page" : "Page");
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          size,
          variant: isActive ? "outline" : "ghost",
        }),
        className,
      )}
      {...props}
    >
      {children ?? <span className="sr-only">{fallback}</span>}
    </a>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PaginationLink>} param0
 * @param {React.ComponentProps<({ children, className, isActive, size, ...props }: any) => ReactJSX.Element>} param0.className
 * @param {React.ComponentProps<({ children, className, isActive, size, ...props }: any) => ReactJSX.Element>} param0....props
 * @returns {ReactJSX.Element>) => ReactJSX.Element}
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:ps-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PaginationLink>} param0
 * @param {React.ComponentProps<({ children, className, isActive, size, ...props }: any) => ReactJSX.Element>} param0.className
 * @param {React.ComponentProps<({ children, className, isActive, size, ...props }: any) => ReactJSX.Element>} param0....props
 * @returns {ReactJSX.Element>) => ReactJSX.Element}
 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pe-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"span">} param0
 * @param {React.ComponentProps<"span">} param0.className
 * @param {React.ComponentProps<"span">} param0....props
 * @returns {ReactJSX.Element}
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
