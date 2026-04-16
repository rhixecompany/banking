import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function HomeFooter(): JSX.Element {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              alt="Horizon Logo"
              width={24}
              height={31}
              loading="eager"
              style={{ height: "auto", width: "auto" }}
              className="h-6 w-auto"
            />
            <span className="font-serif text-xl font-bold text-black-1">
              Horizon
            </span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="/sign-in" className="hover:text-gray-900">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-gray-900">
              Sign Up
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {2026} Horizon Banking. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}
