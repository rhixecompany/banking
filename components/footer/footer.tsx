"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { FooterProps } from "@/types";

import { logoutAccount } from "@/lib/actions/user.actions";

const Footer = ({ type = "desktop", user }: FooterProps): JSX.Element => {
  const router = useRouter();

  const handleLogOut = async (): Promise<void> => {
    const loggedOut = await logoutAccount();
    if (loggedOut) router.push("/sign-in");
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
        onClick={(): void => {
          void handleLogOut();
        }}
      >
        <Image src="/icons/logout.svg" fill sizes="24px" alt="jsm" />
      </div>
    </footer>
  );
};

export default Footer;
