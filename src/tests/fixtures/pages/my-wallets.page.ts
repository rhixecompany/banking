import type { Locator } from "@playwright/test";

import { BasePage } from "./base.page";

/**
 * My Wallets page object for managing linked wallet accounts.
 *
 * @description
 * Provides methods for interacting with the my-wallets page including
 * viewing wallet cards, disconnecting wallets, and adding new wallets.
 *
 * @example
 * ```typescript
 * const myWalletsPage = new MyWalletsPage(page);
 * await myWalletsPage.navigate();
 * await myWalletsPage.getTotalBalance();
 * await myWalletsPage.disconnectWallet("Chase");
 * ```
 */
export class MyWalletsPage extends BasePage {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {"/my-wallets"}
   */
  readonly url = "/my-wallets";

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get pageHeading() {
    return this.getByRole("heading", { name: /my wallets/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get totalBalanceCard() {
    return this.getByText(/total balance/i).locator("..");
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get addBankButton() {
    return this.getByRole("button", { name: /add bank|add wallet/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get walletCards() {
    // Use Card component selector - shadcn/ui Card uses bg-card class
    return this.page.locator('[class*="bg-card"]:has([class*="text-2xl"])');
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get emptyState() {
    return this.getByText(/no banks linked|no wallets linked/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get emptyStateButton() {
    return this.getByRole("button", { name: /link.*first|connect.*first/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @param {string} institutionName
   * @returns {*}
   */
  getWalletCard(institutionName: string) {
    // Use Card component selector - find card by institution name in title
    // Look for any card div that contains the institution name
    return this.page.locator('[class*="bg-card"]').filter({
      has: this.page.getByText(new RegExp(institutionName, "i")),
    });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @param {Locator} walletCard
   * @returns {*}
   */
  getDisconnectButton(walletCard: Locator) {
    return walletCard
      .getByRole("button", { name: /remove|delete|disconnect/i })
      .or(walletCard.getByLabel(/remove/i));
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<string>}
   */
  async getTotalBalance(): Promise<string> {
    const balanceText = await this.totalBalanceCard.textContent();
    return balanceText?.replaceAll(/[^$0-9.]/g, "") ?? "0";
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<number>}
   */
  async getWalletCount(): Promise<number> {
    const cards = this.walletCards;
    const count = await cards.count();
    return count;
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<boolean>}
   */
  async hasWallets(): Promise<boolean> {
    const count = await this.getWalletCount();
    return count > 0;
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<boolean>}
   */
  async isEmpty(): Promise<boolean> {
    return (await this.emptyState.isVisible()) || !(await this.hasWallets());
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} institutionName
   * @returns {Promise<void>}
   */
  async disconnectWallet(institutionName: string): Promise<void> {
    const card = this.getWalletCard(institutionName);
    const button = this.getDisconnectButton(card);
    await button.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async clickAddWallet(): Promise<void> {
    await this.addBankButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async clickConnectFirst(): Promise<void> {
    await this.emptyStateButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnMyWallets(): boolean {
    return this.isAtURL(/\/my-wallets/);
  }
}
