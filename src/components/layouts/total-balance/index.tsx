import type { ReactNode } from "react";

import type { Account } from "@/types";

import TotalBalanceBox from "@/components/total-balance-box/total-balance-box";

// Keep types narrow for now; avoid any in public components.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface AccountView
 * @typedef {AccountView}
 */
interface AccountView {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  institutionId?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  mask?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  name?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  officialName?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  subtype?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  type?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  availableBalance?: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  currentBalance?: number;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface TotalBalanceLayoutProps
 * @typedef {TotalBalanceLayoutProps}
 */
interface TotalBalanceLayoutProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?AccountView[]}
   */
  accounts?: AccountView[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  totalWallets?: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  totalCurrentBalance?: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  className?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?ReactNode}
   */
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
  // Normalize accounts to match the app's Account shape expected by TotalBalanceBox
  const normalizedAccounts = (accounts || []).map((a) => ({
    availableBalance: a.availableBalance ?? 0,
    currentBalance: a.currentBalance ?? 0,
    id: a.id,
    institutionId: a.institutionId ?? "",
    mask: a.mask ?? "",
    name: a.name ?? a.officialName ?? "",
    officialName: a.officialName ?? a.name ?? "",
    // Narrow optional sharableId from incoming prop if present
    sharableId: (a as { sharableId?: string }).sharableId ?? undefined,
    subtype: a.subtype ?? undefined,
    type: a.type ?? "depository",
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
