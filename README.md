# Sauce Demo end-to-end tests

A small Playwright + TypeScript suite for [Sauce Demo](https://www.saucedemo.com/), prepared for the Foundation Health automation assessment. The scope prioritises authentication, cart integrity and the purchase journey within the suggested 2–3 hour implementation budget.

## Setup

Requirements: Node.js 22 or later, npm, and access to Sauce Demo and the Playwright browser download service.

```bash
npm ci
npx playwright install chromium
```

On Linux/CI, install the system dependencies as well:

```bash
npx playwright install --with-deps chromium
```

No environment file or private credentials are needed. The suite uses the site's public `standard_user` / `secret_sauce` demo account and fictional checkout data. Never substitute a real customer's information.

## Run

```bash
npm run typecheck
npm test
```

Other useful commands:

```bash
npm run test:headed
npm run test:ui
npm run test:debug
npx playwright test tests/checkout.spec.ts
npx playwright test --grep "invalid password"
npm run report
```

The default target is `https://www.saucedemo.com`. Override it, if needed, with an equivalent deployment using `BASE_URL` (for example, `BASE_URL=https://www.saucedemo.com npm test` on macOS/Linux). The configured project is desktop Chromium; no local application server is required.

## Coverage and priorities

| Scenario | Assertions | Why prioritise it? |
| --- | --- | --- |
| Successful login | Inventory URL, Products title, six products, cart link | Customers need access to the catalogue. |
| Invalid password | Exact rejection message, login URL and form remain | Incorrect credentials must not grant access. |
| Add and remove products | Badge count, exact product prices and quantities, remaining item, empty cart | Customers must buy the products they selected. |
| Complete checkout | Review products and quantities, subtotal, tax, grand total, completion message, cleared cart | The core purchase flow must work with correct amounts. |
| Required checkout details (three cases) | Field-specific error, checkout does not advance, basket remains | Incomplete details must not proceed to order review. |

Seven independent test cases cover five scenarios. Login is the prerequisite for the three additional functional areas: cart, successful checkout, and checkout validation.

## Structure and design

- `tests/*.spec.ts`: readable scenarios and business assertions.
- `tests/pages/`: small page objects for login, shopping and checkout interactions.
- `tests/fixtures.ts`: reusable page objects and an opt-in authenticated fixture.
- `tests/data.ts`: public demo credentials, expected products and fictional customer details.
- `playwright.config.ts`: target URL, selectors, browser, reporting and failure diagnostics.
- `.github/workflows/playwright.yml`: install, typecheck, run and upload diagnostics on pushes and pull requests; also supports manual runs.

Playwright gives each test an isolated browser context. Authentication runs through the UI for each test that needs it; there is no shared browser, test ordering dependency, or reused cart state. A fresh context keeps this small suite simple. At greater scale, a separately tested login flow and per-test isolated authentication state could reduce repeated setup.

Selectors prefer the application's `data-test` contract and accessible button names. Product controls are scoped to the selected product. Assertions stay visible in tests, while reusable actions live in page objects. Built-in auto-waiting and retrying assertions replace fixed sleeps.

An automatic fixture allows requests only to the configured application origin, blocking third-party telemetry and external fonts. Service workers are disabled so requests stay under this routing policy. App requests are not mocked. This keeps functional tests independent of third-party availability; external integrations and exact font rendering are outside this suite's scope.

Checkout totals use explicit expectations for a known two-item basket: $29.99 + $9.99 = $39.98, plus the demo's 8% tax ($3.20), giving $43.18. This checks against an independent expected result instead of calculating an expected total from the displayed total. Price, catalogue and tax changes will require an intentional review of these expectations.

## Reports and CI

An HTML report is produced after every test run. Failed tests retain a trace and screenshot under `test-results/`; open a trace with `npx playwright show-trace path/to/trace.zip`. Generated reports and dependencies are excluded from version control.

CI runs on Node 22 with two workers and one retry to help diagnose transient failures against a public site. Local runs have no retries. A retried pass should be investigated as a flaky result, not treated as evidence of stability. CI uploads reports and diagnostics for seven days, including on test failures.

## Validation status

See `VALIDATION.md` for the checks actually performed and any execution limitations. Do not treat test discovery or typechecking as an end-to-end pass. Before submitting, run this suite against the live site and inspect the HTML report and GitHub Actions result.

## To Do — if more time were available

In priority order:

1. Authentication boundaries: locked-out user, missing credentials, logout, direct access to protected URLs, and browser back navigation after logout.
2. Cart state: reload persistence, navigation between catalogue/product details/cart, and removing items from the catalogue.
3. Checkout alternatives: cancel/back behaviour, correcting invalid details, empty basket behaviour, and whitespace/length boundaries after clarifying expected validation rules.
4. Catalogue sorting: numerical price sorting in both directions and alphabetical product sorting.
5. Cross-browser and mobile: Firefox, WebKit, and representative narrow viewports, prioritised by supported platforms and usage.
6. Accessibility: keyboard-only completion, focus behaviour, form labels, error announcements, and targeted axe checks.
7. Resilience and visual checks: expected behaviour during slow/failed requests and stable visual baselines for key pages. Keep broad performance/load testing separate from this public demo suite.

Sauce Demo includes intentionally problematic accounts. Keep any future tests for those accounts explicitly separated from the standard-user happy path, with known defects documented rather than hidden with retries.

## Publish and submit

Create an empty **public** repository named `sauce-demo-e2e` on GitHub. If uploading through the GitHub website, extract the supplied archive first and include `.github/workflows/playwright.yml` and `.gitignore`; do not upload the ZIP as the repository contents. Alternatively, from this project folder:

```bash
git init
git add .
git commit -m "Add focused Sauce Demo Playwright assessment suite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sauce-demo-e2e.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. These commands assume the new remote repository is empty. Confirm that the repository is publicly visible, inspect the Actions run, and submit its URL. Review and understand the fixture, page objects, assertions and trade-offs so that you can explain the implementation during the assessment discussion.
