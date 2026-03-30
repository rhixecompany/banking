"use client";

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * Description placeholder
 *
 * @typedef {ToasterProps}
 */
type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Description placeholder
 *
 * @param {ToasterProps} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {*}
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="group"
      icons={{
        error: <OctagonX className="size-4 " />,
        info: <Info className="size-4 " />,
        loading: <LoaderCircle className="size-4  animate-spin" />,
        success: <CircleCheck className="size-4 " />,
        warning: <TriangleAlert className="size-4 " />,
      }}
      toastOptions={{
        classNames: {
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          description: "group-[.toast]:text-muted-foreground",
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
