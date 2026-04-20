import AuthLayoutWrapper from "@/components/layouts/AuthLayoutWrapper";
import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import Image from "next/image";
import { ReactNode } from "react";

/**
 * Auth layout — wraps auth pages with RootProviders and auth gating
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <RootLayoutWrapper>
      {/* AuthLayoutWrapper is an async server component that performs auth gating */}
      {/* It will redirect to /sign-in when the user is not authenticated */}
      <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
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
