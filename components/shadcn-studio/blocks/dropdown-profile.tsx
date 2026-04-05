"use client";

import type { ReactNode } from "react";

import {
  CirclePlusIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  SquarePenIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?(null | string)}
   */
  image?: null | string;
  /**
   * Description placeholder
   * @author [object Object]
   *
   * @type {?boolean}
   */
  defaultOpen?: boolean;
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
 * @param {("center" | "end" | "start")} [param0.align="end"]
 * @param {boolean} param0.defaultOpen
 * @param {string} param0.email
 * @param {string} param0.image
 * @param {string} param0.name
 * @param {ReactNode} param0.trigger
 * @returns {React.JSX.Element}
 */
const ProfileDropdown = ({
  align = "end",
  defaultOpen,
  email,
  image,
  name,
  trigger,
}: Props): React.JSX.Element => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              {image && <AvatarImage src={image} alt={name} />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="absolute end-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2 ring-card" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-lg font-semibold text-foreground">
              {name}
            </span>
            <span className="text-base text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UserIcon className="size-5 text-foreground" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SettingsIcon className="size-5 text-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CreditCardIcon className="size-5 text-foreground" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <UsersIcon className="size-5 text-foreground" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <SquarePenIcon className="size-5 text-foreground" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="px-4 py-2.5 text-base">
            <CirclePlusIcon className="size-5 text-foreground" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
