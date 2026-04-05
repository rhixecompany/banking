"use client";

import type { ReactNode } from "react";

import { ChevronRightIcon, CircleSmallIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
 * @interface Props
 * @typedef {Props}
 */
interface Props {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {ReactNode}
   */
  trigger: ReactNode;
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
   * @type {?("center" | "end" | "start")}
   */
  align?: "center" | "end" | "start";
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {Props} param0
 * @param {("center" | "end" | "start")} [param0.align="start"]
 * @param {{}} param0.navigationData
 * @param {ReactNode} param0.trigger
 * @returns {ReactJSX.Element}
 */
const MenuDropdown = ({ align = "start", navigationData, trigger }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align}>
        {navigationData.map((navItem) => {
          if (navItem.href) {
            return (
              <DropdownMenuItem key={navItem.title} asChild>
                <a href={navItem.href}>
                  {navItem.icon}
                  {navItem.title}
                </a>
              </DropdownMenuItem>
            );
          }

          return (
            <Collapsible key={navItem.title} asChild>
              <DropdownMenuGroup>
                <CollapsibleTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                    className="justify-between"
                  >
                    {navItem.icon}
                    <span className="flex-1">{navItem.title}</span>
                    <ChevronRightIcon className="shrink-0 transition-transform [[data-state=open]>&]:rotate-90" />
                  </DropdownMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent className="ps-2">
                  {navItem.items?.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <a href={item.href}>
                        <CircleSmallIcon />
                        <span>{item.title}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </CollapsibleContent>
              </DropdownMenuGroup>
            </Collapsible>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
