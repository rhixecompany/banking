"use client";

import { LucideIcon } from "lucide-react";
import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {({
 *   items: {
 *     title: string;
 *     url: string;
 *     icon: LucideIcon;
 *   }[];
 * } & React.ComponentPropsWithoutRef<typeof SidebarGroup>)} param0
 * @param {*} param0.items
 * @param {*} param0....props
 * @returns {JSX.Element}
 */
export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>): JSX.Element {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
