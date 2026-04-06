import * as React from "react";

import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "article" | "div" | "section";
}

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
