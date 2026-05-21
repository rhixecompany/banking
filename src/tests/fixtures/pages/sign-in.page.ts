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
  /** Page URL for sign-in */
  readonly url = "/sign-in";

  /** Email input element */
  get emailInput() {
    return this.getByPlaceholder(/enter your email/i);
  }

  /** Password input element */
  get passwordInput() {
    return this.getByPlaceholder(/enter your password/i);
  }

  /** Submit button element */
  get submitButton() {
    return this.getByRole("button", { name: /sign in/i });
  }

  /** Link to sign-up page */
  get signUpLink() {
    return this.getByRole("link", { name: /sign up/i });
  }

  /** Error message element */
  get errorMessage() {
    return this.getByText(/error|invalid|failed/i).first();
  }

  /** Logo heading */
  get logo() {
    return this.getByRole("heading", { name: /horizon/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} email
   * @returns {Promise<void>}
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} password
   * @returns {Promise<void>}
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @returns {Promise<void>}
   */
  async goToSignUp(): Promise<void> {
    await this.signUpLink.click();
    await this.waitForURL(/\/sign-up/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnSignInPage(): boolean {
    return this.isAtURL(/\/sign-in/);
  }
}
