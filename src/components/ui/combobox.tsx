"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const Combobox = ComboboxPrimitive.Root;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Value.Props} param0
 * @param {ComboboxPrimitive.Value.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Trigger.Props} param0
 * @param {ComboboxPrimitive.Trigger.Props} param0.children
 * @param {ComboboxPrimitive.Trigger.Props} param0.className
 * @param {ComboboxPrimitive.Trigger.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxTrigger({
  children,
  className,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className="pointer-events-none size-4 text-muted-foreground"
      />
    </ComboboxPrimitive.Trigger>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Clear.Props} param0
 * @param {ComboboxPrimitive.Clear.Props} param0.className
 * @param {ComboboxPrimitive.Clear.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   showTrigger?: boolean;
 *   showClear?: boolean;
 * } & ComboboxPrimitive.Input.Props)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} [param0.disabled=false]
 * @param {*} [param0.showClear=false]
 * @param {*} [param0.showTrigger=true]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxInput({
  children,
  className,
  disabled = false,
  showClear = false,
  showTrigger = true,
  ...props
}: {
  showTrigger?: boolean;
  showClear?: boolean;
} & ComboboxPrimitive.Input.Props) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Popup.Props &
 *   Pick<
 *     ComboboxPrimitive.Positioner.Props,
 *     "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
 *   >} param0
 * @param {*} [param0.align="start"]
 * @param {*} [param0.alignOffset=0]
 * @param {*} param0.anchor
 * @param {*} param0.className
 * @param {*} [param0.side="bottom"]
 * @param {*} [param0.sideOffset=6]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxContent({
  align = "start",
  alignOffset = 0,
  anchor,
  className,
  side = "bottom",
  sideOffset = 6,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "anchor" | "side" | "sideOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.List.Props} param0
 * @param {ComboboxPrimitive.List.Props} param0.className
 * @param {ComboboxPrimitive.List.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0",
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
 * @param {ComboboxPrimitive.Item.Props} param0
 * @param {ComboboxPrimitive.Item.Props} param0.children
 * @param {ComboboxPrimitive.Item.Props} param0.className
 * @param {ComboboxPrimitive.Item.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxItem({
  children,
  className,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        render={
          <span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Group.Props} param0
 * @param {ComboboxPrimitive.Group.Props} param0.className
 * @param {ComboboxPrimitive.Group.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.GroupLabel.Props} param0
 * @param {ComboboxPrimitive.GroupLabel.Props} param0.className
 * @param {ComboboxPrimitive.GroupLabel.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-sm",
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
 * @param {ComboboxPrimitive.Collection.Props} param0
 * @param {ComboboxPrimitive.Collection.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Empty.Props} param0
 * @param {ComboboxPrimitive.Empty.Props} param0.className
 * @param {ComboboxPrimitive.Empty.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
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
 * @param {ComboboxPrimitive.Separator.Props} param0
 * @param {ComboboxPrimitive.Separator.Props} param0.className
 * @param {ComboboxPrimitive.Separator.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Chips.Props &
 *   React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips>} param0
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxChips({
  className,
  ...props
}: ComboboxPrimitive.Chips.Props &
  React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
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
 * @param {({
 *   showRemove?: boolean;
 * } & ComboboxPrimitive.Chip.Props)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} [param0.showRemove=true]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxChip({
  children,
  className,
  showRemove = true,
  ...props
}: {
  showRemove?: boolean;
} & ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ms-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {ComboboxPrimitive.Input.Props} param0
 * @param {ComboboxPrimitive.Input.Props} param0.children
 * @param {ComboboxPrimitive.Input.Props} param0.className
 * @param {ComboboxPrimitive.Input.Props} param0....props
 * @returns {ReactJSX.Element}
 */
function ComboboxChipsInput({
  children,
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
