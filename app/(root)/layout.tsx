import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import type { User } from "@/types";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");
  const typedUser = user as unknown as User;
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={typedUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="menu icon" width={30} height={39} />
          <div className="">
            <MobileNav user={typedUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
