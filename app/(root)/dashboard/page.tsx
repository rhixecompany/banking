import Link from "next/link";
import { redirect } from "next/navigation";

import HeaderBox from "@/components/HeaderBox";
import { PlaidLink } from "@/components/plaid-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";

/**
 * Dashboard page component.
 * Displays user overview with linked banks, total balance, and quick actions.
 *
 * @export
 * @async
 * @returns {Promise<JSX.Element>}
 */
export default async function DashboardPage(): Promise<JSX.Element> {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's banks
  const banks = await bankDal.findByUserId(userId);

  // Quick stats
  const stats = [
    {
      description: "Total connected accounts",
      label: "Linked Banks",
      value: banks.length.toString(),
    },
    {
      description: banks.length > 0 ? "Primary account" : "No accounts linked",
      label: "Account Type",
      value: banks[0]?.accountType ?? "N/A",
    },
    {
      description: "Most recent activity",
      label: "Last Updated",
      value: banks[0]?.updatedAt
        ? new Date(banks[0].updatedAt).toLocaleDateString()
        : "N/A",
    },
  ];

  return (
    <section className="space-y-8">
      <header>
        <HeaderBox
          type="greeting"
          title="Welcome back,"
          user={user.name ?? "User"}
          subtext="Here's your financial overview"
        />
      </header>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common banking operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <PlaidLink userId={userId} variant="default" />
            <Link
              href="/payment-transfer"
              className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Transfer Money
            </Link>
            <Link
              href="/transaction-history"
              className="block w-full rounded-md border border-input bg-background px-4 py-2 text-center text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              View Transactions
            </Link>
          </CardContent>
        </Card>

        {/* Linked Banks Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Linked Banks</CardTitle>
            <CardDescription>
              Your connected financial institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {banks.length === 0 ? (
              <div className="py-4 text-center">
                <p className="mb-4 text-muted-foreground">
                  No banks linked yet
                </p>
                <PlaidLink userId={userId} variant="outline">
                  Link Your First Bank
                </PlaidLink>
              </div>
            ) : (
              <div className="space-y-3">
                {banks.slice(0, 3).map((bank) => (
                  <div
                    key={bank.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {bank.institutionName ?? "Unknown Bank"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bank.accountType ?? "Account"} -{" "}
                        {bank.accountSubtype ?? "Standard"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link
                        href="/my-banks"
                        className="text-sm text-primary hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
                {banks.length > 3 && (
                  <Link
                    href="/my-banks"
                    className="block text-center text-sm text-primary hover:underline"
                  >
                    View all {banks.length} banks
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
