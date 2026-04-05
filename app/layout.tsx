import type { Metadata } from "next";

import { Merriweather, Roboto } from "next/font/google";
import { ReactNode, Suspense } from "react";

import { Toaster } from "@/components/ui/sonner";
import { RootProviders } from "@/providers/root-providers";

import "./globals.css";

/**
 * Description placeholder
 *
 * @type {*}
 */
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });
/**
 * Description placeholder
 *
 * @type {*}
 */
const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
});

/**
 * Description placeholder
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Horizon is a modern banking platform for everyone.",
  icons: {
    icon: "/icons/logo.svg",
  },
  title: "Horizon",
};

/**
 * Description placeholder
 *
 * @export
 * @param {Readonly<{ children: ReactNode }>} param0
 * @param {Readonly<{ children: ReactNode; }>} param0.children
 * @returns {*}
 */
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${merriweather.variable}`}>
        <Suspense fallback={undefined}>
          <RootProviders>{children}</RootProviders>
        </Suspense>
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
