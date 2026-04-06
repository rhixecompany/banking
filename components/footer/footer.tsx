"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

import type { FooterProps } from "@/types";

import { logoutAccount } from "@/actions/user.actions";

/**
 * Footer component displays user info and logout functionality.
 * Used in sidebar and mobile navigation for account management.
 *
 * @description
 * Renders a footer section with user avatar initial, name, email, and logout button.
 * Supports two layout variants: "desktop" for the sidebar and "mobile" for the
 * mobile navigation drawer. Triggers logout via the server action and redirects
 * to the sign-in page.
 *
 * @example
 * ```tsx
 * <Footer user={session.user} type="desktop" />
 * <Footer user={session.user} type="mobile" />
 * ```
 *
 * @param props - Component props
 * @param props.type - Layout variant: "desktop" for sidebar, "mobile" for drawer
 * @param props.user - Authenticated user data with name and email
 * @returns Rendered footer with user info and logout button
 */
const Footer = ({ type = "desktop", user }: FooterProps): JSX.Element => {
  const handleLogOut = async (): Promise<void> => {
    await logoutAccount();
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user?.name?.[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="truncate text-14 font-semibold text-gray-700">
          {user?.name}
        </h1>
        <p className="truncate text-14 font-normal text-gray-600">
          {user?.email}
        </p>
      </div>
      <div
        className="footer_image"
        role="button"
        tabIndex={0}
        onClick={(): void => {
          void handleLogOut();
        }}
        onKeyDown={(e): void => {
          if (e.key === "Enter" || e.key === " ") void handleLogOut();
        }}
      >
        <Image src="/icons/logout.svg" fill sizes="24px" alt="jsm" />
      </div>
    </footer>
  );
};

export default Footer;
