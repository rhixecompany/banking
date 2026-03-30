import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<"nav">} param0
 * @param {React.ComponentProps<"nav">} param0.className
 * @param {React.ComponentProps<"nav">} param0....props
 * @returns
 */
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

/**
 * Description placeholder
 *
 * @type {*}
 */
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/**
 * Description placeholder
 *
 * @type {*}
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/**
 * Description placeholder
 *
 * @typedef {PaginationLinkProps}
 */
type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

/**
 * Description placeholder
 *
 * @param {PaginationLinkProps} param0
 * @param {*} param0.className
 * @param {*} param0.isActive
 * @param {*} [param0.size="icon"]
 * @param {*} param0....props
 * @returns
 */
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? "outline" : "ghost",
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<typeof PaginationLink>} param0
 * @param {React.ComponentProps<{ ({ className, isActive, size, ...props }: any): any; displayName: string; }>} param0.className
 * @param {React.ComponentProps<{ ({ className, isActive, size, ...props }: any): any; displayName: string; }>} param0....props
 * @returns
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 ps-2.5", className)}
    {...props}
  >
    <ChevronLeft className="size-4 " />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<typeof PaginationLink>} param0
 * @param {React.ComponentProps<{ ({ className, isActive, size, ...props }: any): any; displayName: string; }>} param0.className
 * @param {React.ComponentProps<{ ({ className, isActive, size, ...props }: any): any; displayName: string; }>} param0....props
 * @returns
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pe-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="size-4 " />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<"span">} param0
 * @param {React.ComponentProps<"span">} param0.className
 * @param {React.ComponentProps<"span">} param0....props
 * @returns
 */
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-9  items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="size-4 " />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
