import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface ContainerProps
 * @typedef {ContainerProps}
 * @augments {React.HTMLAttributes<HTMLDivElement>}
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?("article" | "div" | "section")}
   */
  as?: "article" | "div" | "section";
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("container mx-auto px-4 py-6", className)}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { Container };
