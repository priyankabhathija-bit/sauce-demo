import { test, expect } from './fixtures';
import { products } from './data';

test('cart retains selected products and updates when an item is removed', async ({ page, authenticatedShop: shop }) => {
  await shop.addItem(products.backpack.name);
  await shop.addItem(products.bikeLight.name);
  await expect(shop.cartBadge).toHaveText('2');

  await shop.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(shop.cartItems).toHaveCount(2);
  for (const product of [products.backpack, products.bikeLight]) {
    await expect(shop.item(product.name).getByTestId('inventory-item-price')).toHaveText(product.price);
    await expect(shop.item(product.name).getByTestId('item-quantity')).toHaveText('1');
  }

  await shop.removeItem(products.backpack.name);
  await expect(shop.item(products.backpack.name)).toHaveCount(0);
  await expect(shop.item(products.bikeLight.name)).toBeVisible();
  await expect(shop.cartItems).toHaveCount(1);
  await expect(shop.cartBadge).toHaveText('1');

  await shop.removeItem(products.bikeLight.name);
  await expect(shop.cartItems).toHaveCount(0);
  await expect(shop.cartBadge).toHaveCount(0);
});
