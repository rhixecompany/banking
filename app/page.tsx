import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              alt="Horizon Logo"
              width={30}
              height={39}
              className="h-8 w-auto"
              style={{ width: "auto" }}
            />
            <span className="font-ibm-plex-serif text-[26px] font-bold text-black-1">
              Horizon
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-bank-gradient text-white shadow-form hover:bg-blue-600"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 py-20 sm:py-32">
          <div className="absolute inset-0 bg-[url('/icons/gradient-mesh.svg')] bg-cover bg-center opacity-50" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Modern Banking for{" "}
                <span className="bg-bank-gradient bg-clip-text text-transparent">
                  Everyone
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
                Experience the future of banking with Horizon. Secure, fast, and
                designed with you in mind. Manage your finances anytime,
                anywhere.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="min-w-[180px] bg-bank-gradient text-lg text-white shadow-form hover:bg-blue-600"
                  >
                    Open Free Account
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[180px] text-lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

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
                className="h-6 w-auto"
                style={{ width: "auto" }}
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
              &copy; {new Date().getFullYear()} Horizon Banking. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
