import { test, expect } from './fixtures';
import { demoUser } from './data';

test('standard user can log in and view products', async ({ page, loginPage, shop }) => {
  await loginPage.goto();
  await loginPage.login(demoUser.username, demoUser.password);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(shop.title).toHaveText('Products');
  await expect(shop.cartItems).toHaveCount(6);
  await expect(shop.cartLink).toBeVisible();
});

test('invalid password is rejected without granting access', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login(demoUser.username, 'incorrect-password');

  await expect(loginPage.error).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).toHaveURL(/\/$/);
  await expect(loginPage.submit).toBeVisible();
});
