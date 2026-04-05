"use client";

import {
  BarChart3Icon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ProfileDropdown from "@/components/shadcn-studio/blocks/dropdown-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @interface AdminSidebarProps
 * @typedef {AdminSidebarProps}
 */
interface AdminSidebarProps {
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {{
   *     name: string;
   *     email: string;
   *     image?: null | string;
   *   }}
   */
  user: {
    name: string;
    email: string;
    image?: null | string;
  };
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {{
 *   label: string;
 *   href: "/admin" | "/settings";
 *   icon: React.JSX.Element;
 * }[]}
 */
const navItems: {
  label: string;
  href: "/admin" | "/settings";
  icon: React.JSX.Element;
}[] = [
  {
    href: "/admin",
    icon: <LayoutDashboardIcon className="size-4" />,
    label: "Dashboard",
  },
  {
    href: "/admin",
    icon: <WalletIcon className="size-4" />,
    label: "Transactions",
  },
  {
    href: "/admin",
    icon: <UsersIcon className="size-4" />,
    label: "Users",
  },
  {
    href: "/admin",
    icon: <BarChart3Icon className="size-4" />,
    label: "Analytics",
  },
];

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {AdminSidebarProps} param0
 * @param {{ name: string; email: string; image?: string; }} param0.user
 * @returns {React.JSX.Element}
 */
const AdminSidebar = ({ user }: AdminSidebarProps): React.JSX.Element => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="Horizon logo"
            width={30}
            height={30}
          />
          <span className="text-lg font-semibold text-foreground">
            Horizon Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <SettingsIcon className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Profile dropdown pinned at bottom of sidebar */}
      <div className="mt-auto border-t p-3 ">
        <ProfileDropdown
          name={user.name}
          email={user.email}
          image={user.image}
          align="start"
          trigger={
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 p-2 "
            >
              <Avatar className="size-8 rounded-md">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="rounded-md text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm leading-tight font-medium">
                  {user.name}
                </span>
                <span className="text-xs leading-tight text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </Button>
          }
        />
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
