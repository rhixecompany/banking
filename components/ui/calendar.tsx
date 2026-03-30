"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<typeof DayPicker> & {
 *   buttonVariant?: React.ComponentProps<typeof Button>["variant"];
 * }} param0
 * @param {*} param0.className
 * @param {*} param0.classNames
 * @param {*} [param0.showOutsideDays=true]
 * @param {*} [param0.captionLayout="label"]
 * @param {*} [param0.buttonVariant="ghost"]
 * @param {*} param0.formatters
 * @param {*} param0.components
 * @param {*} param0....props
 * @returns {*}
 */
function Calendar({
  buttonVariant = "ghost",
  captionLayout = "label",
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = true,
  ...props
}: {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
} & React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-white p-3 [--cell-size:2rem] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent dark:bg-slate-950",
        String.raw`[.rdp-button\_next>svg]:**:rtl:rotate-180`,
        String.raw`[.rdp-button\_previous>svg]:**:rtl:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size)  p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size)  p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400",
          defaultClassNames.caption_label,
        ),
        day: cn(
          "group/day relative aspect-square size-full  p-0 text-center select-none [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day,
        ),
        disabled: cn(
          "text-slate-500 opacity-50 dark:text-slate-400",
          defaultClassNames.disabled,
        ),
        dropdown: cn(
          "absolute inset-0 bg-white opacity-0 dark:bg-slate-950",
          defaultClassNames.dropdown,
        ),
        dropdown_root: cn(
          "relative rounded-md border border-slate-200 shadow-2xs has-focus:border-slate-950 has-focus:ring-[3px] has-focus:ring-slate-950/50 dark:border-slate-800 dark:has-focus:border-slate-300 dark:has-focus:ring-slate-300/50",
          defaultClassNames.dropdown_root,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        outside: cn(
          "text-slate-500 aria-selected:text-slate-500 dark:text-slate-400 dark:aria-selected:text-slate-400",
          defaultClassNames.outside,
        ),
        range_end: cn(
          "rounded-r-md bg-slate-100 dark:bg-slate-800",
          defaultClassNames.range_end,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_start: cn(
          "rounded-l-md bg-slate-100 dark:bg-slate-800",
          defaultClassNames.range_start,
        ),
        root: cn("w-fit", defaultClassNames.root),
        table: "w-full border-collapse",
        today: cn(
          "rounded-md bg-slate-100 text-slate-900 data-[selected=true]:rounded-none dark:bg-slate-800 dark:text-slate-50",
          defaultClassNames.today,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number: cn(
          "text-[0.8rem] text-slate-500 select-none dark:text-slate-400",
          defaultClassNames.week_number,
        ),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        weekday: cn(
          "flex-1 rounded-md text-[0.8rem] font-normal text-slate-500 select-none dark:text-slate-400",
          defaultClassNames.weekday,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          );
        },
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * Description placeholder
 *
 * @param {React.ComponentProps<typeof DayButton>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0.day
 * @param {React.ComponentProps<any>} param0.modifiers
 * @param {React.ComponentProps<any>} param0....props
 * @returns {*}
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-md data-[range-end=true]:bg-slate-900 data-[range-end=true]:text-slate-50 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-slate-100 data-[range-middle=true]:text-slate-900 data-[range-start=true]:rounded-md data-[range-start=true]:bg-slate-900 data-[range-start=true]:text-slate-50 data-[selected-single=true]:bg-slate-900 data-[selected-single=true]:text-slate-50 dark:data-[range-end=true]:bg-slate-50 dark:data-[range-end=true]:text-slate-900 dark:data-[range-middle=true]:bg-slate-800 dark:data-[range-middle=true]:text-slate-50 dark:data-[range-start=true]:bg-slate-50 dark:data-[range-start=true]:text-slate-900 dark:data-[selected-single=true]:bg-slate-50 dark:data-[selected-single=true]:text-slate-900 [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
