import Image from "next/image";
import { ReactNode } from "react";

/**
 * Description placeholder
 *
 * @export
 * @param {Readonly<{ children: ReactNode }>} param0
 * @param {Readonly<{ children: ReactNode; }>} param0.children
 * @returns {*}
 */
// Auth layout
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
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
            style={{ height: "auto", width: "auto" }}
            loading="eager"
            className="rounded-l-xl object-contain"
          />
        </div>
      </div>
    </main>
  );
}
