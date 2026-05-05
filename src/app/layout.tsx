import type { Metadata } from "next";

import { Merriweather, Roboto } from "next/font/google";
import { ReactNode } from "react";

import RootLayoutWrapper from "@/components/layouts/RootLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
 * @param {{ children: ReactNode }} param0
 * @param {{ children: ReactNode }} param0.children
 * @returns {*}
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${merriweather.variable}`}>
        <RootLayoutWrapper>
          <TooltipProvider>{children}</TooltipProvider>
        </RootLayoutWrapper>
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
