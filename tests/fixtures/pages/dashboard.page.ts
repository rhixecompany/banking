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
  readonly url = "/dashboard";

  get welcomeHeading() {
    return this.getByRole("heading", { name: /welcome back/i });
  }

  get totalBalanceHeading() {
    return this.getByRole("heading", { name: /total current balance/i });
  }

  get walletCount() {
    return this.getByText(/wallet accounts?:\s*\d+/i);
  }

  get linkWalletButton() {
    return this.getByRole("button", { name: /link.*wallet/i });
  }

  get addWalletButton() {
    return this.getByRole("button", { name: /add.*wallet/i }).or(
      this.getByText(/add wallet/i),
    );
  }

  get walletsSection() {
    return this.getByRole("heading", { name: /linked wallets/i }).locator("..");
  }

  get recentTransactions() {
    return this.getByRole("heading", { name: /recent transactions/i }).locator(
      "..",
    );
  }

  get sidebar() {
    return this.getByRole("navigation", { name: /main navigation/i });
  }

  get logoutButton() {
    return this.getByRole("button", { name: /logout/i }).or(
      this.getByRole("img", { name: /logout/i }),
    );
  }

  async getWalletCount(): Promise<number> {
    const text = await this.walletCount.textContent();
    const match = text?.match(/\d+/);
    return match ? Number.parseInt(match[0], 10) : 0;
  }

  async clickLinkWallet(): Promise<void> {
    await this.linkWalletButton.click();
  }

  async clickAddWallet(): Promise<void> {
    await this.addWalletButton.click();
  }

  async goToMyWallets(): Promise<void> {
    await this.getByRole("link", { name: /my banks|my wallets/i }).click();
    await this.waitForURL(/\/my-wallets/);
  }

  async goToTransactions(): Promise<void> {
    await this.getByRole("link", { name: /transaction history/i }).click();
    await this.waitForURL(/\/transaction-history/);
  }

  async goToTransfer(): Promise<void> {
    await this.getByRole("link", { name: /payment transfer/i }).click();
    await this.waitForURL(/\/payment-transfer/);
  }

  isOnDashboard(): boolean {
    return this.isAtURL(/\/dashboard/);
  }

  async hasWallets(): Promise<boolean> {
    const count = await this.getWalletCount();
    return count > 0;
  }
}
