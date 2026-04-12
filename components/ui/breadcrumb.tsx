import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  {
    separator?: React.ReactNode;
  } & React.ComponentPropsWithoutRef<"nav">
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  {
    asChild?: boolean;
  } & React.ComponentPropsWithoutRef<"a">
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {React.ComponentProps<"li">} param0
 * @param {React.ComponentProps<"li">} param0.children
 * @param {React.ComponentProps<"li">} param0.className
 * @param {React.ComponentProps<"li">} param0....props
 * @returns
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5 ", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {React.ComponentProps<"span">} param0
 * @param {React.ComponentProps<"span">} param0.className
 * @param {React.ComponentProps<"span">} param0....props
 * @returns
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-9  items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal data-icon="inline-end" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
