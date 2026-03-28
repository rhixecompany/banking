import Image from "next/image";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            alt="Auth image"
            width={500}
            height={500}
            style={{ width: "auto", height: "auto" }}
            loading="eager"
            className="rounded-l-xl object-contain"
          />
        </div>
      </div>
    </main>
  );
}
