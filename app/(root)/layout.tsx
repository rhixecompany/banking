import Sidebar from '@/components/Sidebar';
import React, { ReactNode } from 'react';
import Image from 'next/image';
import MobileNav from '@/components/MobileNav';
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const loggedIn = {
    firstName: 'Adrian',
    lastName: 'JSM',
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image
            src="/icons/logo.svg"
            alt="menu icon"
            width={30}
            height={39}

          />
          <div className="">
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>

    </main>
  );
}
