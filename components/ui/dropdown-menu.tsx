"use client";

import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Root>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Portal>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Content>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} [param0.sideOffset=4]
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Group>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   inset?: boolean;
 *   variant?: "default" | "destructive";
 * } & React.ComponentProps<typeof DropdownMenuPrimitive.Item>)} param0
 * @param {*} param0.className
 * @param {*} param0.inset
 * @param {*} [param0.variant="default"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: {
  inset?: boolean;
  variant?: "default" | "destructive";
} & React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:ps-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>} param0
 * @param {React.ComponentProps<any>} param0.checked
 * @param {React.ComponentProps<any>} param0.children
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>} param0
 * @param {React.ComponentProps<any>} param0.children
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 ps-8 pe-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute start-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   inset?: boolean;
 * } & React.ComponentProps<typeof DropdownMenuPrimitive.Label>)} param0
 * @param {*} param0.className
 * @param {*} param0.inset
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: {
  inset?: boolean;
} & React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:ps-8",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Separator>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
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
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.Sub>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   inset?: boolean;
 * } & React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0.inset
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: {
  inset?: boolean;
} & React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:ps-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
