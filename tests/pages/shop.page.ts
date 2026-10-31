import { type Page } from '@playwright/test';

export class ShopPage {
  constructor(private readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }
  get cartLink() {
    return this.page.getByTestId('shopping-cart-link');
  }
  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }
  get cartItems() {
    return this.page.getByTestId('inventory-item');
  }

  // Scope controls by product so the test cannot accidentally add a different item.
  item(name: string) {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async addItem(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async removeItem(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
