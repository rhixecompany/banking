import type { ReactNode } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @interface NavigationItem
 * @typedef {NavigationItem}
 */
export interface NavigationItem {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {string}
   */
  title: string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {string}
   */
  href: string;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @typedef {NavigationSection}
 */
export type NavigationSection = (
  | {
      items: NavigationItem[];
      href?: never;
    }
  | {
      items?: never;
      href: string;
    }
) & {
  title: string;
  icon?: ReactNode;
};

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface MenuNavigationProps
 * @typedef {MenuNavigationProps}
 */
interface MenuNavigationProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {NavigationSection[]}
   */
  navigationData: NavigationSection[];
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?string}
   */
  className?: string;
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {MenuNavigationProps} param0
 * @param {string} param0.className
 * @param {{}} param0.navigationData
 * @returns {ReactJSX.Element}
 */
const MenuNavigation = ({ className, navigationData }: MenuNavigationProps) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex-wrap justify-start gap-0">
        {navigationData.map((navItem) => {
          if (navItem.href) {
            // Root link item
            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent px-3 py-1.5 text-base! text-muted-foreground hover:text-primary dark:hover:bg-accent/50",
                  )}
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Section with dropdown
          return (
            <NavigationMenuItem key={navItem.title}>
              <NavigationMenuTrigger className="bg-transparent px-3 py-1.5 text-base text-muted-foreground hover:text-primary dark:hover:bg-accent/50 dark:data-[state=open]:hover:bg-accent/50 [&>svg]:size-4">
                {navItem.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute w-auto data-[motion=from-end]:slide-in-from-right-30! data-[motion=from-start]:slide-in-from-left-30! data-[motion=to-end]:slide-out-to-right-30! data-[motion=to-start]:slide-out-to-left-30!">
                <ul className="grid w-38 gap-4">
                  <li>
                    {navItem.items?.map((item) => (
                      <NavigationMenuLink key={item.title} href={item.href}>
                        {item.title}
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuNavigation;
