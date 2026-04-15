"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SidebarProps } from "@/types";

import Footer from "@/components/footer/footer";
import { sidebarLinks } from "@/constants";

/**
 * Sidebar navigation component for desktop view.
 * Displays Horizon branding, navigation links with active state highlighting,
 * and user account footer with logout functionality.
 *
 * @description
 * Renders the main left-side navigation bar for authenticated pages.
 * Shows the Horizon logo, all navigation links with icons, and highlights
 * the current page based on URL. Includes the Footer component with user
 * info and logout button.
 *
 * @example
 * ```tsx
 * <Sidebar user={session.user} />
 * ```
 *
 * @param props - Component props
 * @param props.user - Authenticated user data for personalization and footer
 * @returns Rendered sidebar navigation
 */
const Sidebar = ({
  user,
  logoutAccount,
}: SidebarProps & {
  logoutAccount?: () => Promise<boolean>;
}): JSX.Element => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="Horizon logo"
            width={34}
            height={34}
            loading="eager"
            style={{ height: "auto", width: "auto" }}
            className="size-6 max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link
              key={item.label}
              href={item.route as "/"}
              className={`sidebar-link${isActive ? " bg-bank-gradient" : ""}`}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  sizes="24px"
                  className={isActive ? "brightness-[3] invert-0" : undefined}
                />
              </div>
              <p className={`sidebar-label${isActive ? " text-white!" : ""}`}>
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>
      <Footer user={user} logoutAccount={logoutAccount} />
    </section>
  );
};

export default Sidebar;
