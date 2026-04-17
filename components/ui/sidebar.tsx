"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"sidebar_state"}
 */
const SIDEBAR_COOKIE_NAME = "sidebar_state";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {number}
 */
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"16rem"}
 */
const SIDEBAR_WIDTH = "16rem";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"18rem"}
 */
const SIDEBAR_WIDTH_MOBILE = "18rem";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"3rem"}
 */
const SIDEBAR_WIDTH_ICON = "3rem";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"b"}
 */
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface SidebarContextProps
 * @typedef {SidebarContextProps}
 */
interface SidebarContextProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {("collapsed" | "expanded")}
   */
  state: "collapsed" | "expanded";
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  open: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(open: boolean) => void}
   */
  setOpen: (open: boolean) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  openMobile: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(open: boolean) => void}
   */
  setOpenMobile: (open: boolean) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  isMobile: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {() => void}
   */
  toggleSidebar: () => void;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SidebarContext = React.createContext<null | SidebarContextProps>(null);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   defaultOpen?: boolean;
 *   open?: boolean;
 *   onOpenChange?: (open: boolean) => void;
 * } & React.ComponentProps<"div">)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} [param0.defaultOpen=true]
 * @param {*} param0.onOpenChange: setOpenProp
 * @param {*} param0.open: openProp
 * @param {*} param0.style
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarProvider({
  children,
  className,
  defaultOpen = true,
  onOpenChange: setOpenProp,
  open: openProp,
  style,
  ...props
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: ((value: boolean) => boolean) | boolean) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      isMobile,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   side?: "left" | "right";
 *   variant?: "floating" | "inset" | "sidebar";
 *   collapsible?: "icon" | "none" | "offcanvas";
 * } & React.ComponentProps<"div">)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} [param0.collapsible="offcanvas"]
 * @param {*} [param0.side="left"]
 * @param {*} [param0.variant="sidebar"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function Sidebar({
  children,
  className,
  collapsible = "offcanvas",
  side = "left",
  variant = "sidebar",
  ...props
}: {
  side?: "left" | "right";
  variant?: "floating" | "inset" | "sidebar";
  collapsible?: "icon" | "none" | "offcanvas";
} & React.ComponentProps<"div">) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex size-full  flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]"
            : "end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full  flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<typeof Button>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0.onClick
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"button">} param0
 * @param {React.ComponentProps<"button">} param0.className
 * @param {React.ComponentProps<"button">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex rtl:translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize rtl:in-data-[side=left]:cursor-e-resize rtl:in-data-[side=right]:cursor-w-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize rtl:[[data-side=left][data-state=collapsed]_&]:cursor-w-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize rtl:[[data-side=right][data-state=collapsed]_&]:cursor-e-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:start-full hover:group-data-[collapsible=offcanvas]:bg-sidebar rtl:group-data-[collapsible=offcanvas]:-translate-x-0",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-end-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-start-2",
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
 * @param {React.ComponentProps<"main">} param0
 * @param {React.ComponentProps<"main">} param0.className
 * @param {React.ComponentProps<"main">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2",
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
 * @param {React.ComponentProps<typeof Input>} param0
 * @param {React.ComponentProps<any>} param0.className
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
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
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
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
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
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
 * @param {React.ComponentProps<any>} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
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
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
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
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({ asChild?: boolean } & React.ComponentProps<"div">)} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarGroupLabel({
  asChild = false,
  className,
  ...props
}: { asChild?: boolean } & React.ComponentProps<"div">) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
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
 * @param {({ asChild?: boolean } & React.ComponentProps<"button">)} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarGroupAction({
  asChild = false,
  className,
  ...props
}: { asChild?: boolean } & React.ComponentProps<"button">) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute end-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
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
function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"ul">} param0
 * @param {React.ComponentProps<"ul">} param0.className
 * @param {React.ComponentProps<"ul">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"li">} param0
 * @param {React.ComponentProps<"li">} param0.className
 * @param {React.ComponentProps<"li">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
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
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-8 text-sm",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
        sm: "h-7 text-xs",
      },
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
    },
  },
);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   asChild?: boolean;
 *   isActive?: boolean;
 *   tooltip?: React.ComponentProps<typeof TooltipContent> | string;
 * } & React.ComponentProps<"button"> &
 *   VariantProps<typeof sidebarMenuButtonVariants>} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} [param0.isActive=false]
 * @param {*} [param0.size="default"]
 * @param {*} param0.tooltip
 * @param {*} [param0.variant="default"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuButton({
  asChild = false,
  className,
  isActive = false,
  size = "default",
  tooltip,
  variant = "default",
  ...props
}: {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: React.ComponentProps<typeof TooltipContent> | string;
} & React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ size, variant }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {({
 *   asChild?: boolean;
 *   showOnHover?: boolean;
 * } & React.ComponentProps<"button">)} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} [param0.showOnHover=false]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuAction({
  asChild = false,
  className,
  showOnHover = false,
  ...props
}: {
  asChild?: boolean;
  showOnHover?: boolean;
} & React.ComponentProps<"button">) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute end-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
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
function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
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
 *   showIcon?: boolean;
 * } & React.ComponentProps<"div">)} param0
 * @param {*} param0.className
 * @param {*} [param0.showIcon=false]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: {
  showIcon?: boolean;
} & React.ComponentProps<"div">) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ComponentProps<"ul">} param0
 * @param {React.ComponentProps<"ul">} param0.className
 * @param {React.ComponentProps<"ul">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5 rtl:-translate-x-px",
        "group-data-[collapsible=icon]:hidden",
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
 * @param {React.ComponentProps<"li">} param0
 * @param {React.ComponentProps<"li">} param0.className
 * @param {React.ComponentProps<"li">} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
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
 *   size?: "md" | "sm";
 *   isActive?: boolean;
 * } & React.ComponentProps<"a">)} param0
 * @param {*} [param0.asChild=false]
 * @param {*} param0.className
 * @param {*} [param0.isActive=false]
 * @param {*} [param0.size="md"]
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
function SidebarMenuSubButton({
  asChild = false,
  className,
  isActive = false,
  size = "md",
  ...props
}: {
  asChild?: boolean;
  size?: "md" | "sm";
  isActive?: boolean;
} & React.ComponentProps<"a">) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 rtl:translate-x-px [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
