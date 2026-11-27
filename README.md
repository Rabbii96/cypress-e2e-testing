# cypress-e2e-testing

[![Cypress tests](https://github.com/Rabbii96/cypress-e2e-testing/actions/workflows/cypress.yml/badge.svg)](https://github.com/Rabbii96/cypress-e2e-testing/actions/workflows/cypress.yml)

UI and API test automation with **Cypress**: custom commands, fixtures, data-driven tests,
`cy.request` API tests and a Chrome + Electron CI matrix with nightly runs.

| Suite | Target | Covers |
|---|---|---|
| `e2e/ui/login.cy.js` | [the-internet](https://the-internet.herokuapp.com) | login/logout, protected route redirect, data-driven negative logins from a fixture |
| `e2e/ui/interactions.cy.js` | the-internet | dynamic loading without fixed waits, checkboxes, dropdowns, add/remove, JS confirm dialogs, broken-image detection |
| `e2e/api/dummyjson.cy.js` | [DummyJSON](https://dummyjson.com) | token auth flow, 400/401/404 paths, pagination, search correctness, sort order, create |

## 🐞 Bug found while writing the suite

DummyJSON's `GET /auth/me` returns the logged-in user's **password** in the response body.
The suite keeps a *characterization test* (`KNOWN BUG: …`) that documents it: if the API is fixed the
test fails, which reminds us to turn it into a normal "must not expose password" assertion.
On a real team this would be a bug report with steps, request/response and severity — an API returning
200 with correct-looking data can still be a security issue.

## Patterns used

- **Custom commands** (`cypress/support/commands.js`): `cy.loginUi()`, `cy.flashShouldContain()`, `cy.apiToken()`
- **Fixtures** for test data; one generated test per invalid-login row
- **No `cy.wait(ms)`** — assertions retry until the timeout, so tests are fast and not flaky
- Passwords typed with `{ log: false }`
- Retries only in `cypress run` (CI), screenshots uploaded on failure

## Run

```bash
npm ci
npx cypress run            # headless, all specs
npm run test:api           # API only
npx cypress open           # interactive runner
```

---

By [Fazle Rabbi](https://www.linkedin.com/in/frabbii/) — SDET & DevOps engineer. AI-assisted (Claude Code), reviewed and run before commit.
