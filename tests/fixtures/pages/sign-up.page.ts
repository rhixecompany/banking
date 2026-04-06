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
  readonly url = "/sign-up";

  get firstNameInput() {
    return this.getByPlaceholder(/enter your first name/i);
  }

  get lastNameInput() {
    return this.getByPlaceholder(/enter your last name/i);
  }

  get emailInput() {
    return this.getByPlaceholder(/enter your email/i);
  }

  get passwordInput() {
    return this.getByPlaceholder(/enter your password/i);
  }

  get confirmPasswordInput() {
    return this.getByPlaceholder(/confirm your password/i);
  }

  get addressInput() {
    return this.getByPlaceholder(/enter your address/i);
  }

  get cityInput() {
    return this.getByPlaceholder(/enter your city/i);
  }

  get stateInput() {
    return this.getByPlaceholder(/enter your state/i);
  }

  get postalCodeInput() {
    return this.getByPlaceholder(/enter your postal code/i);
  }

  get dateOfBirthInput() {
    return this.getByPlaceholder(/yyyy-mm-dd/i);
  }

  get ssnInput() {
    return this.getByPlaceholder(/example: 1234/i);
  }

  get submitButton() {
    return this.getByRole("button", { name: /sign up/i });
  }

  get signInLink() {
    return this.getByRole("link", { name: /sign in/i });
  }

  get successMessage() {
    return this.getByText(/success|registered|check your email/i).first();
  }

  async fillFirstName(name: string): Promise<void> {
    await this.firstNameInput.fill(name);
  }

  async fillLastName(name: string): Promise<void> {
    await this.lastNameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

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

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
    await this.waitForURL(/\/sign-in/);
  }

  isOnSignUpPage(): boolean {
    return this.isAtURL(/\/sign-up/);
  }
}
