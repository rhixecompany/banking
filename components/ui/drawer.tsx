"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<typeof DrawerPrimitive.Root>} param0
 * @param {React.ComponentProps<any>} [param0.shouldScaleBackground=true]
 * @param {React.ComponentProps<any>} param0....props
 * @returns
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerTrigger = DrawerPrimitive.Trigger;

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerPortal = DrawerPrimitive.Portal;

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerClose = DrawerPrimitive.Close;

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

/**
 * Description placeholder
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} param0
 * @param {React.HTMLAttributes<HTMLDivElement>} param0.className
 * @param {React.HTMLAttributes<HTMLDivElement>} param0....props
 * @returns
 */
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-start", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

/**
 * Description placeholder
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} param0
 * @param {React.HTMLAttributes<HTMLDivElement>} param0.className
 * @param {React.HTMLAttributes<HTMLDivElement>} param0....props
 * @returns
 */
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

/**
 * Description placeholder
 *
 * @type {*}
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
