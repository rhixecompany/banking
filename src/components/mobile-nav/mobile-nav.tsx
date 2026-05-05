"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { User as UserType } from "@/types/user";

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
 * Mobile navigation component for the root layout.
 * Provides mobile-friendly navigation and logout.
 */
export default function MobileNav({
  logoutAccount,
  user,
}: {
  user: Pick<UserType, "email" | "id" | "image" | "name">;
  logoutAccount?: () => Promise<boolean>;
}): JSX.Element {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="flex items-center justify-center">
          <Image
            src="/icons/hamburger.svg"
            alt="menu"
            width={30}
            height={30}
            className="cursor-pointer"
            role="button"
            aria-label="Open navigation menu"
          />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none bg-white pt-6 sm:max-w-xs"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation menu</SheetTitle>
          <SheetDescription>
            Browse banking pages and account actions.
          </SheetDescription>
        </SheetHeader>

        <nav className="mobilenav-sheet">
          <div className="flex h-full flex-col gap-6">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Horizon logo"
              >
                <Image
                  src="/icons/logo.svg"
                  alt="Horizon logo"
                  width={34}
                  height={34}
                  loading="eager"
                  style={{ height: "auto", width: "auto" }}
                />
                <p className="font-ibm-plex-serif text-26 font-bold text-black-1">
                  Horizon
                </p>
              </Link>
            </SheetClose>

            <div className="flex flex-1 flex-col gap-4">
              {sidebarLinks.map((item) => {
                const isActive =
                  pathname === item.route ||
                  pathname.startsWith(`${item.route}/`);

                return (
                  <SheetClose asChild key={item.route}>
                    <Link
                      href={item.route as "/"}
                      className={`mobilenav-sheet_close${isActive ? " bg-bank-gradient" : " hover:bg-gray-100"}`}
                    >
                      <div className="relative size-6">
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          fill
                          sizes="24px"
                          className={
                            isActive ? "brightness-[3] invert-0" : undefined
                          }
                        />
                      </div>
                      <p
                        className={`text-16 font-semibold${isActive ? " text-white" : " text-black-2"}`}
                      >
                        {item.label}
                      </p>
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </div>

          <Footer user={user} type="mobile" logoutAccount={logoutAccount} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
