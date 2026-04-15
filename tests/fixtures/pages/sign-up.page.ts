import { BasePage } from "./base.page";

/**
 * Sign-up page object for user registration flows.
 *
 * @description
 * Provides methods for interacting with the sign-up form including
 * full profile registration and navigation to sign-in.
 *
 * @example
 * ```typescript
 * const signUpPage = new SignUpPage(page);
 * await signUpPage.navigate();
 * await signUpPage.fillFirstName("John");
 * await signUpPage.fillLastName("Doe");
 * await signUpPage.fillEmail("john@example.com");
 * await signUpPage.fillPassword("SecurePass123");
 * await signUpPage.submit();
 * ```
 */
export class SignUpPage extends BasePage {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {"/sign-up"}
   */
  readonly url = "/sign-up";

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get firstNameInput() {
    return this.getByPlaceholder(/enter your first name/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get lastNameInput() {
    return this.getByPlaceholder(/enter your last name/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get emailInput() {
    return this.getByPlaceholder(/enter your email/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get passwordInput() {
    return this.getByPlaceholder(/enter your password/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get confirmPasswordInput() {
    return this.getByPlaceholder(/confirm your password/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get addressInput() {
    return this.getByPlaceholder(/enter your address/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get cityInput() {
    return this.getByPlaceholder(/enter your city/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get stateInput() {
    return this.getByPlaceholder(/enter your state/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get postalCodeInput() {
    return this.getByPlaceholder(/enter your postal code/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get dateOfBirthInput() {
    return this.getByPlaceholder(/yyyy-mm-dd/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get ssnInput() {
    return this.getByPlaceholder(/example: 1234/i);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get submitButton() {
    return this.getByRole("button", { name: /sign up/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get signInLink() {
    return this.getByRole("link", { name: /sign in/i });
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @readonly
   * @type {*}
   */
  get successMessage() {
    return this.getByText(/success|registered|check your email/i).first();
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} name
   * @returns {Promise<void>}
   */
  async fillFirstName(name: string): Promise<void> {
    await this.firstNameInput.fill(name);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {string} name
   * @returns {Promise<void>}
   */
  async fillLastName(name: string): Promise<void> {
    await this.lastNameInput.fill(name);
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
   * @param {string} password
   * @returns {Promise<void>}
   */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @async
   * @param {{
   *     firstName?: string;
   *     lastName?: string;
   *     email?: string;
   *     password?: string;
   *     address?: string;
   *     city?: string;
   *     state?: string;
   *     postalCode?: string;
   *     dateOfBirth?: string;
   *     ssn?: string;
   *   }} data
   * @returns {Promise<void>}
   */
  async fillProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    dateOfBirth?: string;
    ssn?: string;
  }): Promise<void> {
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.email) await this.fillEmail(data.email);
    if (data.password) await this.fillPassword(data.password);
    if (data.address) await this.addressInput.fill(data.address);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) await this.stateInput.fill(data.state);
    if (data.postalCode) await this.postalCodeInput.fill(data.postalCode);
    if (data.dateOfBirth) await this.dateOfBirthInput.fill(data.dateOfBirth);
    if (data.ssn) await this.ssnInput.fill(data.ssn);
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
   * @returns {Promise<void>}
   */
  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
    await this.waitForURL(/\/sign-in/);
  }

  /**
   * Description placeholder
   * @author Adminbot
   *
   * @returns {boolean}
   */
  isOnSignUpPage(): boolean {
    return this.isAtURL(/\/sign-up/);
  }
}
