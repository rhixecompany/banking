import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function CtaGetStarted(): JSX.Element {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20 text-white">
      <Container>
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
      </Container>
    </section>
  );
}
