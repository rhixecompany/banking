import type { Metadata } from "next";

import { IBM_Plex_Serif, Inter } from "next/font/google";
import { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { RootProviders } from "@/providers/root-providers";

import "./globals.css";

/**
 * Description placeholder
 *
 * @type {*}
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
/**
 * Description placeholder
 *
 * @type {*}
 */
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
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
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <RootProviders>{children}</RootProviders>
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
