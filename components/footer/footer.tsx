"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

import type { FooterProps } from "@/types";

import { logoutAccount } from "@/lib/actions/user.actions";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {FooterProps} param0
 * @param {FooterProps} [param0.type="desktop"]
 * @param {FooterProps} param0.user
 * @returns {JSX.Element}
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
