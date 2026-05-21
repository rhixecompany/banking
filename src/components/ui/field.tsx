"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"fieldset">} param0
 * @param {React.ComponentProps<"fieldset">} param0.className
 * @param {React.ComponentProps<"fieldset">} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
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
 * @param {({ variant?: "label" | "legend" } & React.ComponentProps<"legend">)} param0
 * @param {*} param0.className
 * @param {*} [param0.variant="legend"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: { variant?: "label" | "legend" } & React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
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
 * @param {React.ComponentProps<"div">} param0
 * @param {React.ComponentProps<"div">} param0.className
 * @param {React.ComponentProps<"div">} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
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
 * @type {*}
 */
const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    defaultVariants: {
      orientation: "vertical",
    },
    variants: {
      orientation: {
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
      },
    },
  },
);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {(React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>)} param0
 * @param {*} param0.className
 * @param {*} [param0.orientation="vertical"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
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
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
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
 * @param {React.ComponentProps<typeof Label>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10",
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
 * @param {React.ComponentProps<"div">} param0
 * @param {React.ComponentProps<"div">} param0.className
 * @param {React.ComponentProps<"div">} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
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
 * @param {React.ComponentProps<"p">} param0
 * @param {React.ComponentProps<"p">} param0.className
 * @param {React.ComponentProps<"p">} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
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
 *   children?: React.ReactNode;
 * } & React.ComponentProps<"div">)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function FieldSeparator({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   errors?: ({ message?: string } | undefined)[];
 * } & React.ComponentProps<"div">)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0.errors
 * @param {*} param0....props
 * @returns {*}
 */
function FieldError({
  children,
  className,
  errors,
  ...props
}: {
  errors?: ({ message?: string } | undefined)[];
} & React.ComponentProps<"div">) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
