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
  readonly url = "/payment-transfer";

  get pageHeading() {
    return this.getByRole("heading", { name: /payment transfer/i });
  }

  get sourceWalletSelect() {
    return this.getByLabel(/from bank account|source wallet/i);
  }

  get recipientSelect() {
    return this.getByLabel(/to recipient/i);
  }

  get amountInput() {
    return this.getByLabel(/amount.*usd/i);
  }

  get submitButton() {
    return this.getByRole("button", { name: /send transfer|submit/i });
  }

  get transferSummary() {
    return this.getByRole("heading", { name: /transfer summary/i }).locator(
      "..",
    );
  }

  get successMessage() {
    return this.getByText(/transfer initiated|success/i).first();
  }

  get errorMessage() {
    return this.getByText(/error|failed|insufficient/i).first();
  }

  get noWalletsMessage() {
    return this.getByText(/no wallets linked/i);
  }

  get sourceWalletOption() {
    return (walletName: string) =>
      this.getByRole("option", { name: new RegExp(walletName, "i") });
  }

  get recipientOption() {
    return (name: string) =>
      this.getByRole("option", { name: new RegExp(name, "i") });
  }

  async selectSourceWallet(walletName: string): Promise<void> {
    await this.sourceWalletSelect.click();
    await this.getSourceWalletOptionLocator(walletName).click();
  }

  private getSourceWalletOptionLocator(walletName: string): Locator {
    return this.page.getByRole("option", {
      name: new RegExp(walletName, "i"),
    });
  }

  async selectRecipient(recipientName: string): Promise<void> {
    await this.recipientSelect.click();
    await this.page
      .getByRole("option", { name: new RegExp(recipientName, "i") })
      .click();
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async submitTransfer(): Promise<void> {
    await this.submitButton.click();
  }

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

  async hasSourceWallets(): Promise<boolean> {
    return !(await this.noWalletsMessage.isVisible());
  }

  isOnTransferPage(): boolean {
    return this.isAtURL(/\/payment-transfer/);
  }
}
