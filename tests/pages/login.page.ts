import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  get username() {
    return this.page.getByTestId('username');
  }
  get password() {
    return this.page.getByTestId('password');
  }
  get submit() {
    return this.page.getByTestId('login-button');
  }
  get error() {
    return this.page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
