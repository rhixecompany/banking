import type { MenuData } from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";
import type { NavigationSection } from "@/components/shadcn-studio/blocks/menu-navigation";

import CtaGetStarted from "@/components/layouts/cta-get-started";
import FeaturesGrid from "@/components/layouts/features-grid";
import HomeFooter from "@/components/layouts/home-footer";
import TotalBalanceLayout from "@/components/layouts/total-balance";
import Header from "@/components/shadcn-studio/blocks/hero-section-41/header";
import HeroSection from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41";
import { Container } from "@/components/ui/container";

const navigationData: NavigationSection[] = [];

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {MenuData[]}
 */
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

        <FeaturesGrid />

        <CtaGetStarted />

        <section className="bg-gray-50 py-16">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Render presentational TotalBalanceLayout with static props. */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                {/* Static/mock props only — Home must remain public/static */}
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
