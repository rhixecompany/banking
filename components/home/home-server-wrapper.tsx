import Image from "next/image";
import Link from "next/link";

import type { MenuData } from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";

import Header from "@/components/shadcn-studio/blocks/hero-section-41/header";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";
import { Button } from "@/components/ui/button";

const navigationData: never[] = [];

const bankingMenuData: MenuData[] = [
  {
    id: 1,
    img: "https://picsum.photos/seed/banking1/480/480",
    imgAlt: "Secure online banking dashboard",
    userAvatar: "https://picsum.photos/seed/avatar1/80/80",
    userComment: "Horizon makes managing my finances effortless.",
  },
  {
    id: 2,
    img: "https://picsum.photos/seed/banking2/480/480",
    imgAlt: "Instant money transfers",
    userAvatar: "https://picsum.photos/seed/avatar2/80/80",
    userComment: "Instant transfers with zero fees — game changer!",
  },
  {
    id: 3,
    img: "https://picsum.photos/seed/banking3/480/480",
    imgAlt: "Track spending and transactions",
    userAvatar: "https://picsum.photos/seed/avatar3/80/80",
    userComment: "I love seeing all my accounts in one place.",
  },
];

/**
 * Landing page component — publicly accessible, no auth required.
 *
 * @export
 * @returns {JSX.Element}
 */
export function HomeServerWrapper(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header navigationData={navigationData} />

      <main className="flex-1 pt-17.5">
        <HeroSection menudata={bankingMenuData} />

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Why Choose Horizon?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                We provide a seamless banking experience that puts you in
                control of your finances.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
                  <Image
                    src="/icons/coins.svg"
                    alt="Instant Transfers"
                    width={32}
                    height={32}
                    className="text-blue-600"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Instant Transfers
                </h3>
                <p className="text-gray-600">
                  Send and receive money instantly with zero delays. No more
                  waiting for transactions to clear.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                  <Image
                    src="/icons/dollar-circle.svg"
                    alt="Secure Banking"
                    width={32}
                    height={32}
                    className="text-green-600"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Bank-Grade Security
                </h3>
                <p className="text-gray-600">
                  Your money and data are protected with industry-leading
                  encryption and security measures.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
                  <Image
                    src="/icons/monitor.svg"
                    alt="Account Management"
                    width={32}
                    height={32}
                    className="text-purple-600"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Easy Management
                </h3>
                <p className="text-gray-600">
                  View all your accounts, transactions, and balances in one
                  unified dashboard.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-100">
                  <Image
                    src="/icons/a-coffee.svg"
                    alt="24/7 Support"
                    width={32}
                    height={32}
                    className="text-orange-600"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Our dedicated support team is always here to help you whenever
                  you need assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
              Join thousands of satisfied customers who trust Horizon for their
              daily banking needs. It only takes a few minutes to create your
              account.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="min-w-[200px] bg-white text-blue-600 shadow-lg hover:bg-blue-50"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-blue-600">0</div>
                <div className="text-lg font-medium text-gray-900">
                  Monthly Fees
                </div>
                <p className="mt-2 text-gray-600">
                  No hidden charges. Keep more of your money with our fee-free
                  accounts.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-green-600">
                  100%
                </div>
                <div className="text-lg font-medium text-gray-900">
                  FDIC Insured
                </div>
                <p className="mt-2 text-gray-600">
                  Your deposits are protected up to $250,000 through our partner
                  banks.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl font-bold text-purple-600">
                  5 min
                </div>
                <div className="text-lg font-medium text-gray-900">
                  Quick Setup
                </div>
                <p className="mt-2 text-gray-600">
                  Open your account in minutes with our streamlined onboarding
                  process.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
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
              <span className="font-ibm-plex-serif text-xl font-bold text-black-1">
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
        </div>
      </footer>
    </div>
  );
}
