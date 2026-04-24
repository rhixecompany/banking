import Image from "next/image";
import { ReactNode } from "react";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";

/**
 * Auth layout — wraps auth pages with RootProviders (NO auth gating).
 * Auth pages (sign-in, sign-up) are public pages for unauthenticated users.
 * Auth gating is handled per-page via AuthPageWrapper.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <RootLayoutWrapper>
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth image"
            width={500}
            height={500}
            style={{ height: "auto", width: "auto" }}
            loading="eager"
            className="rounded-l-xl object-contain"
          />
        </div>
      </div>
    </RootLayoutWrapper>
  );
}
