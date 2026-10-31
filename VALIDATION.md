# Validation record

Validated on 28 October 2026 against https://www.saucedemo.com/.

| Check | Result |
| --- | --- |
| Dependency installation | Passed; exact dependency versions and npm lockfile included |
| `npm run typecheck` | Passed |
| `npx playwright test --list` | Seven Chromium tests discovered in three spec files |
| Live end-to-end run | **7 passed in 51.3 seconds**, two workers, zero retries |
| Public GitHub repository and hosted Actions run | Pending publication |

The live run used Playwright 1.56.1, Chromium Headless Shell 141.0.7390.37 and Node.js 24.22.1. CI is configured for Node 22; its result is not yet verified.

## Preparation environment

Initial browser downloads returned invalid archives; the pinned release's fallback download succeeded. An initial direct-network run failed at navigation with `ERR_EMPTY_RESPONSE`, before exercising the app. The preparation environment required its outbound proxy and interception certificate handling, configured through a separate temporary validation config. Those proxy and certificate exceptions are not in the delivered project. Normal local/CI execution uses the committed config and normal certificate verification.

The site's third-party telemetry also triggered an automatic review block during preparation. The final suite uses an automatic request fixture that allows only the application origin and disables service workers, blocking third-party telemetry and fonts. The successful run used this final fixture and real, unmocked Sauce Demo application requests.

## Before submission

Run `npm ci`, `npx playwright install chromium`, `npm run typecheck` and `npm test` on your machine, then inspect `npm run report`. Publish the project in a public GitHub repository, check the Actions result, and submit the repository URL. The passing preparation run does not guarantee future availability of the public demo or replace a hosted CI check.
