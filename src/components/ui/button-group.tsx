import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    defaultVariants: {
      orientation: "horizontal",
    },
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-0 [&>*:not(:last-child)]:rounded-e-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
  },
);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {(React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>)} param0
 * @param {*} param0.className
 * @param {*} param0.orientation
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   asChild?: boolean;
 * } & React.ComponentProps<"div">)} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function ButtonGroupText({
  asChild = false,
  className,
  ...props
}: {
  asChild?: boolean;
} & React.ComponentProps<"div">) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
 * @param {React.ComponentProps<typeof Separator>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} [param0.orientation="vertical"]
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
