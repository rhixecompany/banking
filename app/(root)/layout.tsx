import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

import MobileNav from "@/components/mobile-nav/mobile-nav";
import Sidebar from "@/components/sidebar/sidebar";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getUserWithProfile } from "@/lib/actions/user.actions";

/**
 * Protected banking layout content component.
 * Checks authentication and redirects to sign-in if not authenticated.
 */
async function ProtectedLayoutContent({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<JSX.Element> {
  const { ok, user } = await getUserWithProfile();
  if (!ok || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={user} />
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
            <MobileNav user={user} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

/**
 * Protected banking layout wrapper with Suspense boundary.
 */
export default function BankingLayout({
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
