"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PopoverPrimitive.Root>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PopoverPrimitive.Trigger>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PopoverPrimitive.Content>} param0
 * @param {React.ComponentProps<any>} [param0.align="center"]
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} [param0.sideOffset=4]
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverContent({
  align = "center",
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof PopoverPrimitive.Anchor>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"div">} param0
 * @param {React.ComponentProps<"div">} param0.className
 * @param {React.ComponentProps<"div">} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"h2">} param0
 * @param {React.ComponentProps<"h2">} param0.className
 * @param {React.ComponentProps<"h2">} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"p">} param0
 * @param {React.ComponentProps<"p">} param0.className
 * @param {React.ComponentProps<"p">} param0....props
 * @returns {ReactJSX.Element}
 */
function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
