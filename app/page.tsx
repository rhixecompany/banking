import type { Metadata } from "next";

import CtaGetStarted from "@/components/layouts/cta-get-started";
import FeaturesGrid from "@/components/layouts/features-grid";
import HomeFooter from "@/components/layouts/home-footer";
import TotalBalanceLayout from "@/components/layouts/total-balance";
import HeroSection, {
  type MenuData,
} from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";
import { Container } from "@/components/ui/container";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  description: "Manage your bank accounts and transactions",
  title: "Home | Horizon Banking",
};

const sampleMenudata: MenuData[] = [
  {
    id: 1,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-18.png",
    imgAlt: "plate-1",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png",
    userComment:
      "The ambiance is perfect and the food is absolutely delicious.",
  },
  {
    id: 2,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-19.png",
    imgAlt: "plate-2",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png",
    userComment: "Best dining experience in town. The staff is friendly.",
  },
  {
    id: 3,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png",
    userComment:
      "Every dish is crafted with care. This place never disappoints!",
  },
];

/**
 * Home page route — publicly accessible, no auth required.
 * Static landing page with no Suspense or auth wrappers.
 */
export default function HomePage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-17.5">
        <HeroSection menudata={sampleMenudata} />

        <FeaturesGrid />

        <CtaGetStarted />

        <section className="bg-gray-50 py-16">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <TotalBalanceLayout
                  accounts={[
                    {
                      availableBalance: 1000,
                      currentBalance: 1200,
                      id: "acc-1",
                      institutionId: "ins-1",
                      mask: "1234",
                      name: "Checking",
                      officialName: "Primary Checking",
                      subtype: "checking",
                      type: "depository",
                    },
                    {
                      availableBalance: 5000,
                      currentBalance: 5200,
                      id: "acc-2",
                      institutionId: "ins-2",
                      mask: "5678",
                      name: "Savings",
                      officialName: "High-Yield Savings",
                      subtype: "savings",
                      type: "depository",
                    },
                  ]}
                  totalWallets={2}
                  totalCurrentBalance={6400}
                />
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
          </Container>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
