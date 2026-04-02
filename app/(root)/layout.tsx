import Image from "next/image";
import { ReactNode, Suspense } from "react";

import type { User } from "@/types";

import MobileNav from "@/components/mobile-nav/mobile-nav";
import Sidebar from "@/components/sidebar/sidebar";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getLoggedInUser } from "@/lib/actions/user.actions";

/**
 * Protected layout content component.
 * Checks authentication and redirects to sign-in if not authenticated.
 *
 * @export
 * @async
 * @param {Readonly<{ children: ReactNode }>} props
 * @param {ReactNode} props.children
 * @returns {Promise<JSX.Element>}
 */
async function ProtectedLayoutContent({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<JSX.Element> {
  const user = await getLoggedInUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }
  const typedUser = user as unknown as User;

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={typedUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            alt="menu icon"
            width={30}
            height={39}
            loading="eager"
            style={{ height: "auto", width: "auto" }}
          />
          <div className="">
            <MobileNav user={typedUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

/**
 * Protected layout wrapper with Suspense boundary.
 * Required in Next.js 16 to handle async auth APIs without blocking route rendering.
 *
 * @export
 * @param {Readonly<{ children: ReactNode }>} props
 * @param {ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex-center min-h-screen">
          <LoadingSpinner className="size-12" />
        </div>
      }
    >
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </Suspense>
  );
}
