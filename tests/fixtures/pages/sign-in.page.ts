import { BasePage } from "./base.page";

/**
 * Sign-in page object for authentication flows.
 *
 * @description
 * Provides methods for interacting with the sign-in form including
 * email/password authentication and navigation to sign-up.
 *
 * @example
 * ```typescript
 * const signInPage = new SignInPage(page);
 * await signInPage.navigate();
 * await signInPage.fillEmail("user@example.com");
 * await signInPage.fillPassword("password123");
 * await signInPage.submit();
 * ```
 */
export class SignInPage extends BasePage {
  readonly url = "/sign-in";

  get emailInput() {
    return this.getByLabel(/email/i);
  }

  get passwordInput() {
    return this.getByLabel(/password/i);
  }

  get submitButton() {
    return this.getByRole("button", { name: /sign in/i });
  }

  get signUpLink() {
    return this.getByRole("link", { name: /sign up/i });
  }

  get errorMessage() {
    return this.getByText(/error|invalid|failed/i).first();
  }

  get logo() {
    return this.getByRole("heading", { name: /horizon/i });
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async goToSignUp(): Promise<void> {
    await this.signUpLink.click();
    await this.waitForURL(/\/sign-up/);
  }

  isOnSignInPage(): boolean {
    return this.isAtURL(/\/sign-in/);
  }
}
