import { BasePage } from "./base.page";

/**
 * Transaction History page object for viewing account transactions.
 *
 * @description
 * Provides methods for interacting with the transaction history page including
 * viewing transaction tables, filtering, and pagination.
 *
 * @example
 * ```typescript
 * const historyPage = new TransactionHistoryPage(page);
 * await historyPage.navigate();
 * await historyPage.getTransactionCount();
 * await historyPage.goToNextPage();
 * ```
 */
export class TransactionHistoryPage extends BasePage {
  readonly url = "/transaction-history";

  get pageHeading() {
    return this.getByRole("heading", { name: /transaction history/i });
  }

  get transactionTable() {
    return this.getByRole("table");
  }

  get transactions() {
    return this.transactionTable.getByRole("row");
  }

  get noTransactionsMessage() {
    return this.getByText(/no transactions|empty/i).first();
  }

  get pagination() {
    return this.getByRole("navigation", { name: /pagination/i }).or(
      this.getByText(/prev|next/i)
        .first()
        .locator(".."),
    );
  }

  get prevButton() {
    return this.getByRole("button", { name: /prev/i });
  }

  get nextButton() {
    return this.getByRole("button", { name: /next/i });
  }

  get pageInfo() {
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    return this.getByText(/\d+\s*\/\s*\d+/).first();
  }

  get walletTabs() {
    return this.getByRole("tablist");
  }

  getTransactionRow(transactionId: string) {
    return this.transactionTable
      .getByRole("row")
      .filter({ hasText: transactionId });
  }

  getTransactionByName(name: string) {
    return (
      this.transactionTable
        .getByRole("row")
        // eslint-disable-next-line security/detect-non-literal-regexp -- Dynamic transaction name matching is intentional
        .filter({ hasText: new RegExp(name, "i") })
    );
  }

  async getTransactionCount(): Promise<number> {
    const count = await this.transactions.count();
    return count - 1;
  }

  async hasTransactions(): Promise<boolean> {
    return !(await this.noTransactionsMessage.isVisible());
  }

  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    await this.waitForLoadState("networkidle");
  }

  async goToPrevPage(): Promise<void> {
    await this.prevButton.click();
    await this.waitForLoadState("networkidle");
  }

  async selectWalletTab(walletName: string): Promise<void> {
    await this.walletTabs
      // eslint-disable-next-line security/detect-non-literal-regexp -- Dynamic wallet tab name matching is intentional
      .getByRole("tab", { name: new RegExp(walletName, "i") })
      .click();
  }

  isOnHistoryPage(): boolean {
    return this.isAtURL(/\/transaction-history/);
  }

  async getCurrentPage(): Promise<number> {
    const text = await this.pageInfo.textContent();
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 1;
  }

  async getTotalPages(): Promise<number> {
    const text = await this.pageInfo.textContent();
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? Number.parseInt(match[2], 10) : 1;
  }
}
