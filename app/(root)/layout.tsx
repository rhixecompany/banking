import { createLinkToken, exchangePublicToken } from "@/actions/plaid.actions";
import { getUserWithProfile, logoutAccount } from "@/actions/user.actions";
import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import MobileNav from "@/components/mobile-nav/mobile-nav";
import { PlaidProvider } from "@/components/plaid-context/plaid-context";
import Sidebar from "@/components/sidebar/sidebar";
import { LoadingSpinner } from "@/components/ui/spinner";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

/**
 * Protected banking layout content component.
 * Checks authentication and wraps with PlaidProvider for bank-linking functionality.
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
    <PlaidProvider
      userId={user.id}
      createLinkToken={createLinkToken}
      exchangePublicToken={exchangePublicToken}
    >
      <main className="flex h-screen w-full font-sans">
        <Sidebar user={user} logoutAccount={logoutAccount} />
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
              <MobileNav user={user} logoutAccount={logoutAccount} />
            </div>
          </div>
          {children}
        </div>
      </main>
    </PlaidProvider>
  );
}

/**
 * Protected banking layout wrapper with Suspense boundary.
 */
export default function BankingLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <RootLayoutWrapper>
      <Suspense
        fallback={
          <div className="flex-center min-h-screen">
            <LoadingSpinner className="size-12" />
          </div>
        }
      >
        <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
      </Suspense>
    </RootLayoutWrapper>
  );
}
