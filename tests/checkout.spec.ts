import { test, expect } from './fixtures';
import { customer, products } from './data';

test('customer can review correct totals and complete an order', async ({ page, authenticatedShop: shop, checkout }) => {
  await shop.addItem(products.backpack.name);
  await shop.addItem(products.bikeLight.name);
  await shop.openCart();
  await checkout.start();
  await checkout.enterCustomer(customer);
  await checkout.continueButton.click();

  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(shop.cartItems).toHaveCount(2);
  for (const product of [products.backpack, products.bikeLight]) {
    await expect(shop.item(product.name).getByTestId('inventory-item-price')).toHaveText(product.price);
    await expect(shop.item(product.name).getByTestId('item-quantity')).toHaveText('1');
  }
  // Explicit oracle for this basket: 29.99 + 9.99; demo tax is 8%, rounded to cents.
  await expect(checkout.subtotal).toHaveText('Item total: $39.98');
  await expect(checkout.tax).toHaveText('Tax: $3.20');
  await expect(checkout.total).toHaveText('Total: $43.18');

  await checkout.finish();
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(checkout.confirmation).toHaveText('Thank you for your order!');
  await expect(shop.cartBadge).toHaveCount(0);
  await shop.openCart();
  await expect(shop.cartItems).toHaveCount(0);
});

const requiredFields = [
  { missing: 'first name', data: { ...customer, firstName: '' }, error: 'Error: First Name is required' },
  { missing: 'last name', data: { ...customer, lastName: '' }, error: 'Error: Last Name is required' },
  { missing: 'postal code', data: { ...customer, postalCode: '' }, error: 'Error: Postal Code is required' },
];

for (const scenario of requiredFields) {
  test(`checkout blocks progression when ${scenario.missing} is missing`, async ({ page, authenticatedShop: shop, checkout }) => {
    await shop.addItem(products.backpack.name);
    await shop.openCart();
    await checkout.start();
    await checkout.enterCustomer(scenario.data);
    await checkout.continueButton.click();

    await expect(checkout.error).toHaveText(scenario.error);
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkout.continueButton).toBeVisible();
    await expect(shop.cartBadge).toHaveText('1');
  });
}
