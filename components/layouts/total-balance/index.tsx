import type { Account } from "@/types";
import type { ReactNode } from "react";

import TotalBalanceBox from "@/components/total-balance-box/total-balance-box";

// Keep types narrow for now; avoid any in public components.
interface AccountView {
  id: string;
  institutionId?: string;
  mask?: string;
  name?: string;
  officialName?: string;
  subtype?: string;
  type?: string;
  availableBalance?: number;
  currentBalance?: number;
}

interface TotalBalanceLayoutProps {
  accounts?: AccountView[];
  totalWallets?: number;
  totalCurrentBalance?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Presentational layout for total balance — props-only and safe for Home.
 * This component intentionally accepts static/mock props for the Home page.
 */
export default function TotalBalanceLayout({
  accounts = [],
  className,
  totalCurrentBalance = 0,
  totalWallets = 0,
}: TotalBalanceLayoutProps): JSX.Element {
  // Debug: print props during unit tests to diagnose render failures
  // REMOVE or guard this log before committing if noisy in CI.
  if (process.env.NODE_ENV === "test") {
    // eslint-disable-next-line no-console
    console.log("TotalBalanceLayout props:", {
      totalCurrentBalance,
      totalWallets,
      accounts,
    });
  }
  // Normalize accounts to match the app's Account shape expected by TotalBalanceBox
  const normalizedAccounts = (accounts || []).map((a) => ({
    id: a.id,
    availableBalance: a.availableBalance ?? 0,
    currentBalance: a.currentBalance ?? 0,
    officialName: a.officialName ?? a.name ?? "",
    mask: a.mask ?? "",
    institutionId: a.institutionId ?? "",
    sharableId: (a as any).sharableId ?? undefined,
    name: a.name ?? a.officialName ?? "",
    type: a.type ?? "depository",
    subtype: a.subtype ?? undefined,
  })) as unknown as Account[];

  return (
    <div className={className}>
      <TotalBalanceBox
        accounts={normalizedAccounts}
        totalWallets={totalWallets}
        totalCurrentBalance={totalCurrentBalance}
      />
    </div>
  );
}
