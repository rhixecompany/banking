"use client";

import { LogOut } from "lucide-react";

import type { User as UserType } from "@/types/user";

import { Button } from "@/components/ui/button";

/**
 * Mobile navigation component for the root layout.
 * Provides mobile-friendly navigation and logout.
 */
export default function MobileNav({
  user,
  logoutAccount,
}: {
  user: Pick<UserType, "id" | "email" | "name" | "image">;
  logoutAccount?: () => Promise<boolean>;
}): JSX.Element {
  const handleLogout = async () => {
    if (logoutAccount) {
      await logoutAccount();
    }
  };

  return (
    <nav className="flex items-center gap-2 p-2">
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="size-4" />
        <span className="sr-only">Logout</span>
      </Button>
    </nav>
  );
}
