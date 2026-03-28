"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

import type { MobileNavProps } from "@/types";
const MobileNav = ({ user }: MobileNavProps) => {
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
                />
                <h1 className="font-ibm-plex-serif text-26 font-bold text-black-1">
                  Horizon
                </h1>
              </Link>
            </SheetTitle>
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
                        key={item.label}
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
                USER
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
