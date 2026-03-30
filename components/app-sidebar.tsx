"use client";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * Description placeholder
 *
 * @type {{ user: { name: string; email: string; avatar: string; }; navMain: {}; navClouds: {}; navSecondary: {}; documents: {}; }}
 */
const ACTIVE_PROPOSALS = "Active Proposals";

/**
 * Description placeholder
 *
 * @type {{ documents: {}; navClouds: {}; navMain: {}; navSecondary: {}; user: { avatar: string; email: string; name: string; }; }}
 */
const data = {
  documents: [
    {
      icon: DatabaseIcon,
      name: "Data Library",
      url: "#",
    },
    {
      icon: ClipboardListIcon,
      name: "Reports",
      url: "#",
    },
    {
      icon: FileIcon,
      name: "Word Assistant",
      url: "#",
    },
  ],
  navClouds: [
    {
      icon: CameraIcon,
      isActive: true,
      items: [
        {
          title: ACTIVE_PROPOSALS,
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Capture",
      url: "#",
    },
    {
      icon: FileTextIcon,
      items: [
        {
          title: ACTIVE_PROPOSALS,
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Proposal",
      url: "#",
    },
    {
      icon: FileCodeIcon,
      items: [
        {
          title: ACTIVE_PROPOSALS,
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Prompts",
      url: "#",
    },
  ],
  navMain: [
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard",
      url: "#",
    },
    {
      icon: ListIcon,
      title: "Lifecycle",
      url: "#",
    },
    {
      icon: BarChartIcon,
      title: "Analytics",
      url: "#",
    },
    {
      icon: FolderIcon,
      title: "Projects",
      url: "#",
    },
    {
      icon: UsersIcon,
      title: "Team",
      url: "#",
    },
  ],
  navSecondary: [
    {
      icon: SettingsIcon,
      title: "Settings",
      url: "#",
    },
    {
      icon: HelpCircleIcon,
      title: "Get Help",
      url: "#",
    },
    {
      icon: SearchIcon,
      title: "Search",
      url: "#",
    },
  ],
  user: {
    avatar: "/avatars/shadcn.jpg",
    email: "m@example.com",
    name: "shadcn",
  },
};

/**
 * Description placeholder
 *
 * @export
 * @param {React.ComponentProps<typeof Sidebar>} param0
 * @param {React.ComponentProps<any>} param0....props
 * @returns {*}
 */

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): JSX.Element {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="size-5 " />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
