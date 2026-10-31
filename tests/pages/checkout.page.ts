import { type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get firstName() {
    return this.page.getByTestId('firstName');
  }
  get lastName() {
    return this.page.getByTestId('lastName');
  }
  get postalCode() {
    return this.page.getByTestId('postalCode');
  }
  get continueButton() {
    return this.page.getByTestId('continue');
  }
  get error() {
    return this.page.getByTestId('error');
  }
  get subtotal() {
    return this.page.getByTestId('subtotal-label');
  }
  get tax() {
    return this.page.getByTestId('tax-label');
  }
  get total() {
    return this.page.getByTestId('total-label');
  }
  get confirmation() {
    return this.page.getByTestId('complete-header');
  }

  async start() {
    await this.page.getByTestId('checkout').click();
  }

  async enterCustomer(customer: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async finish() {
    await this.page.getByTestId('finish').click();
  }
}
