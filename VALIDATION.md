# Validation record

Validated against https://www.saucedemo.com/ on 31 October 2026.

## GitHub Actions result

| Check | Result |
| --- | --- |
| Dependency installation — `npm ci` | Passed |
| TypeScript checking — `npm run typecheck` | Passed |
| Chromium installation | Passed |
| End-to-end tests — `npm test` | 7 passed in 3.6 seconds |
| Workers | 2 |
| Retries used | 0 |

[View the successful workflow run](https://github.com/priyankabhathija-bit/sauce-demo/actions/runs/41195460912)

The workflow used Node.js 22 and the committed Playwright configuration. No preparation-environment proxy or certificate exceptions were required.

## Scope and limitations

The seven tests cover successful login, invalid-password rejection, cart updates, successful checkout and three required-field validation cases.

Only desktop Chromium was tested. Cross-browser, mobile and accessibility coverage are listed in the README's To Do section.

The suite blocks requests outside the application origin, including third-party telemetry and fonts. Sauce Demo application requests are not mocked.

## Workflow maintenance

The successful run displayed a Node.js runtime deprecation warning for GitHub Actions and an Ubuntu runner migration notice. Neither caused a failure. Updating action versions and reviewing the runner image are follow-up maintenance tasks.

## Reproduce locally

Run these commands from the project folder:

    npm ci
    npx playwright install chromium
    npm run typecheck
    npm test
    npm run report
