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
  /** Page URL for transaction history */
  readonly url = "/transaction-history";

  /** Page heading element */
  get pageHeading() {
    return this.getByRole("heading", { name: /transaction history/i });
  }

  /** Transaction table element */
  get transactionTable() {
    return this.getByRole("table");
  }

  /** Rows inside the transaction table */
  get transactions() {
    return this.transactionTable.getByRole("row");
  }

  /** Message shown when there are no transactions */
  get noTransactionsMessage() {
    return this.getByText(/no transactions|empty/i).first();
  }

  /** Pagination/navigation controls */
  get pagination() {
    return this.getByRole("navigation", { name: /pagination/i }).or(
      this.getByText(/prev|next/i)
        .first()
        .locator(".."),
    );
  }

  /** Previous page button */
  get prevButton() {
    return this.getByRole("button", { name: /prev/i });
  }

  /** Next page button */
  get nextButton() {
    return this.getByRole("button", { name: /next/i });
  }

  /** Page info (e.g. "1 / 5") */
  get pageInfo() {
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    return this.getByText(/\d+\s*\/\s*\d+/).first();
  }

  /** Wallet tab list element */
  get walletTabs() {
    return this.getByRole("tablist");
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @param {string} transactionId
   * @returns {*}
   */
  getTransactionRow(transactionId: string) {
    return this.transactionTable
      .getByRole("row")
      .filter({ hasText: transactionId });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @param {string} name
   * @returns {*}
   */
  getTransactionByName(name: string) {
    return this.transactionTable
      .getByRole("row")
      .filter({ hasText: new RegExp(name, "i") });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<number>}
   */
  async getTransactionCount(): Promise<number> {
    const count = await this.transactions.count();
    return count - 1;
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<boolean>}
   */
  async hasTransactions(): Promise<boolean> {
    return !(await this.noTransactionsMessage.isVisible());
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToNextPage(): Promise<void> {
    await this.nextButton.click();
    await this.waitForLoadState("networkidle");
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToPrevPage(): Promise<void> {
    await this.prevButton.click();
    await this.waitForLoadState("networkidle");
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} walletName
   * @returns {Promise<void>}
   */
  async selectWalletTab(walletName: string): Promise<void> {
    await this.walletTabs
      .getByRole("tab", { name: new RegExp(walletName, "i") })
      .click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnHistoryPage(): boolean {
    return this.isAtURL(/\/transaction-history/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<number>}
   */
  async getCurrentPage(): Promise<number> {
    const text = await this.pageInfo.textContent();
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 1;
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<number>}
   */
  async getTotalPages(): Promise<number> {
    const text = await this.pageInfo.textContent();
    // eslint-disable-next-line regexp/no-super-linear-move -- Simple pagination pattern for UI testing
    const match = text?.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? Number.parseInt(match[2], 10) : 1;
  }
}
