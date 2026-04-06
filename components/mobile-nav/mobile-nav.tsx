"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { MobileNavProps } from "@/types";

import Footer from "@/components/footer/footer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";

/**
 * Mobile navigation drawer component for responsive navigation.
 * Uses shadcn Sheet for slide-out panel on mobile screens.
 * Shows Horizon branding, navigation links, and user account footer.
 *
 * @description
 * Renders a hamburger menu button that opens a slide-out navigation drawer.
 * Displays the Horizon logo, all navigation links with active state highlighting,
 * and the user footer with logout functionality. Automatically highlights the
 * current page based on the URL pathname.
 *
 * @example
 * ```tsx
 * <MobileNav user={session.user} />
 * ```
 *
 * @param props - Component props
 * @param props.user - Authenticated user data for footer display
 * @returns Rendered mobile navigation drawer
 */
const MobileNav = ({ user }: MobileNavProps): JSX.Element => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-66">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            alt="menu"
            width={30}
            height={30}
            role="button"
            aria-label="Open navigation menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <SheetHeader>
            <SheetTitle asChild>
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-1 px-4"
              >
                <Image
                  src="/icons/logo.svg"
                  alt="Horizon logo"
                  width={34}
                  height={34}
                  loading="eager"
                  style={{ height: "auto", width: "auto" }}
                />
                <h1 className="font-serif text-26 font-bold text-black-1">
                  Horizon
                </h1>
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation menu
            </SheetDescription>
          </SheetHeader>

          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);
                  return (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.route as "/"}
                        className={`mobilenav-sheet_close w-full${isActive ? " bg-bank-gradient" : ""}`}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={
                            isActive ? "brightness-[3] invert-0" : undefined
                          }
                        />
                        <p
                          className={`text-16 font-semibold text-black-2${isActive ? " text-white" : ""}`}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
