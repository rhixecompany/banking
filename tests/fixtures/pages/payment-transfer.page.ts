import type { Locator } from "@playwright/test";

import { BasePage } from "./base.page";

/**
 * Payment Transfer page object for initiating ACH transfers.
 *
 * @description
 * Provides methods for interacting with the payment transfer form including
 * selecting source wallet, recipient, and amount for transfers.
 *
 * @example
 * ```typescript
 * const transferPage = new PaymentTransferPage(page);
 * await transferPage.navigate();
 * await transferPage.selectSourceWallet("Chase Checking");
 * await transferPage.selectRecipient("John Doe");
 * await transferPage.enterAmount("100.00");
 * await transferPage.submitTransfer();
 * ```
 */
export class PaymentTransferPage extends BasePage {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {"/payment-transfer"}
   */
  readonly url = "/payment-transfer";

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get pageHeading() {
    return this.getByRole("heading", { name: /payment transfer/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get sourceWalletSelect() {
    return this.getByLabel(/from bank account|source wallet/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get recipientSelect() {
    return this.getByLabel(/to recipient/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get amountInput() {
    return this.getByLabel(/amount.*usd/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get submitButton() {
    return this.getByRole("button", { name: /send transfer|submit/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get transferSummary() {
    return this.getByRole("heading", { name: /transfer summary/i }).locator(
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
  get successMessage() {
    return this.getByText(/transfer initiated|success/i).first();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get errorMessage() {
    return this.getByText(/error|failed|insufficient/i).first();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get noWalletsMessage() {
    return this.getByText(/no wallets linked/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {(walletName: string) => any}
   */
  get sourceWalletOption() {
    return (walletName: string) =>
      this.getByRole("option", { name: new RegExp(walletName, "i") });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {(name: string) => any}
   */
  get recipientOption() {
    return (name: string) =>
      this.getByRole("option", { name: new RegExp(name, "i") });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} walletName
   * @returns {Promise<void>}
   */
  async selectSourceWallet(walletName: string): Promise<void> {
    await this.sourceWalletSelect.click();
    await this.getSourceWalletOptionLocator(walletName).click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @private
   * @param {string} walletName
   * @returns {Locator}
   */
  private getSourceWalletOptionLocator(walletName: string): Locator {
    return this.page.getByRole("option", {
      name: new RegExp(walletName, "i"),
    });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} recipientName
   * @returns {Promise<void>}
   */
  async selectRecipient(recipientName: string): Promise<void> {
    await this.recipientSelect.click();
    await this.page
      .getByRole("option", { name: new RegExp(recipientName, "i") })
      .click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} amount
   * @returns {Promise<void>}
   */
  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async submitTransfer(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {{
   *     sourceWallet?: string;
   *     recipient?: string;
   *     amount?: string;
   *   }} data
   * @returns {Promise<void>}
   */
  async fillTransferForm(data: {
    sourceWallet?: string;
    recipient?: string;
    amount?: string;
  }): Promise<void> {
    if (data.sourceWallet) await this.selectSourceWallet(data.sourceWallet);
    if (data.recipient) await this.selectRecipient(data.recipient);
    if (data.amount) await this.enterAmount(data.amount);
    await this.submitTransfer();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<boolean>}
   */
  async hasSourceWallets(): Promise<boolean> {
    return !(await this.noWalletsMessage.isVisible());
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnTransferPage(): boolean {
    return this.isAtURL(/\/payment-transfer/);
  }
}
