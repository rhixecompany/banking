import Image from "next/image";

import { Container } from "@/components/ui/container";

export default function FeaturesGrid(): JSX.Element {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose Horizon?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We provide a seamless banking experience that puts you in control of
            your finances.
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
              Send and receive money instantly with zero delays. No more waiting
              for transactions to clear.
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
              Your money and data are protected with industry-leading encryption
              and security measures.
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
              View all your accounts, transactions, and balances in one unified
              dashboard.
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
              Our dedicated support team is always here to help you whenever you
              need assistance.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
