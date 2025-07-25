import React, { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      SIDEBAR
      {children}
    </main>
  );
}
