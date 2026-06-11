import { BasePage } from "./base.page";

/**
 * Dashboard page object for the main authenticated view.
 *
 * @description
 * Provides methods for interacting with the dashboard including
 * viewing balance summaries, wallet cards, and navigation to other sections.
 *
 * @example
 * ```typescript
 * const dashboardPage = new DashboardPage(page);
 * await dashboardPage.navigate();
 * await dashboardPage.getTotalBalance();
 * await dashboardPage.clickLinkWallet();
 * ```
 */
export class DashboardPage extends BasePage {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {"/dashboard"}
   */
  readonly url = "/dashboard";

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get welcomeHeading() {
    return this.getByRole("heading", { name: /welcome back/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get totalBalanceHeading() {
    return this.getByRole("heading", { name: /total current balance/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get walletCount() {
    return this.getByText(/wallet accounts?:\s*\d+/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get linkWalletButton() {
    return this.getByRole("button", { name: /link.*wallet/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get addWalletButton() {
    return this.getByRole("button", { name: /add.*wallet/i }).or(
      this.getByText(/add wallet/i),
    );
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get walletsSection() {
    return this.getByRole("heading", { name: /linked wallets/i }).locator("..");
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get recentTransactions() {
    return this.getByRole("heading", { name: /recent transactions/i }).locator(
      "..",
    );
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get sidebar() {
    return this.getByRole("navigation", { name: /main navigation/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get logoutButton() {
    return this.getByRole("button", { name: /logout/i }).or(
      this.getByRole("img", { name: /logout/i }),
    );
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<number>}
   */
  async getWalletCount(): Promise<number> {
    const text = await this.walletCount.textContent();
    const match = text?.match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async clickLinkWallet(): Promise<void> {
    await this.linkWalletButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async clickAddWallet(): Promise<void> {
    await this.addWalletButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToMyWallets(): Promise<void> {
    await this.getByRole("link", { name: /my banks|my wallets/i }).click();
    await this.waitForURL(/\/my-wallets/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToTransactions(): Promise<void> {
    await this.getByRole("link", { name: /transaction history/i }).click();
    await this.waitForURL(/\/transaction-history/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToTransfer(): Promise<void> {
    await this.getByRole("link", { name: /payment transfer/i }).click();
    await this.waitForURL(/\/payment-transfer/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnDashboard(): boolean {
    return this.isAtURL(/\/dashboard/);
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
}
