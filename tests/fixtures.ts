import { test as base, expect } from '@playwright/test';
import { demoUser } from './data';
import { LoginPage } from './pages/login.page';
import { ShopPage } from './pages/shop.page';
import { CheckoutPage } from './pages/checkout.page';

type Fixtures = {
  appRequestsOnly: void;
  loginPage: LoginPage;
  shop: ShopPage;
  checkout: CheckoutPage;
  authenticatedShop: ShopPage;
};

export const test = base.extend<Fixtures>({
  // Keep this functional suite independent of external telemetry and font services.
  appRequestsOnly: [async ({ context, baseURL }, use) => {
    const appOrigin = new URL(baseURL!).origin;
    await context.route('**/*', async (route) => {
      if (new URL(route.request().url()).origin === appOrigin) {
        await route.continue();
      } else {
        await route.abort('blockedbyclient');
      }
    });
    await use();
  }, { auto: true }],
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shop: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  authenticatedShop: async ({ page, loginPage, shop }, use) => {
    await loginPage.goto();
    await loginPage.login(demoUser.username, demoUser.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(shop.title).toHaveText('Products');
    await use(shop);
  },
});

export { expect };
