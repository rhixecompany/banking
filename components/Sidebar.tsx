"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { default as Footer } from "./Footer";

import type { SiderbarProps } from "@/types";
const Sidebar = ({ user }: SiderbarProps) => {
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
                  className={isActive ? "brightness-[3] invert-0" : undefined}
                />
              </div>
              <p className={`sidebar-label${isActive ? " text-white!" : ""}`}>
                {item.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      <Footer user={user} />
    </section>
  );
};

export default Sidebar;
