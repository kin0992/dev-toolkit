# Consuming dev-toolkit from another repository

`dev-toolkit` is distributed via two complementary channels:

1. **Reusable GitHub workflows & composite actions** — referenced by path/ref. Pin to `main` for rolling updates or to a tag (e.g. `v1`) for stability.
2. **npm packages on GitHub Packages** — under the `@kin0992` scope. Use `latest` or caret ranges to inherit minor/patch updates.

---

## 1. Reusable GitHub workflows

### Static analysis

In your consumer repo, create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  ci:
    uses: kin0992/dev-toolkit/.github/workflows/static-analysis.yml@main
    with:
      node-version: '22'
      working-directory: '.'
```

Skip individual steps via boolean inputs (`run-build`, `run-lint`, `run-typecheck`, `run-format-check`, `run-test`).

### IaC drift detection (Pulumi)

```yaml
name: IaC Drift
on:
  schedule: [{ cron: '0 6 * * *' }]
  pull_request:
    paths: ['infra/**']

jobs:
  drift:
    uses: kin0992/dev-toolkit/.github/workflows/iac-drift.yml@main
    with:
      stack: kin0992/myapp/dev
      working-directory: infra
    secrets:
      PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
```

### Pinning strategy

| Goal                    | Reference                          |
| ----------------------- | ---------------------------------- |
| Always latest (rolling) | `@main`                            |
| Stable major            | `@v1` (after first tagged release) |
| Reproducible            | `@<commit-sha>`                    |

---

## 2. npm packages from GitHub Packages

### Authenticate

Create or update `.npmrc` in the consumer repo:

```
@kin0992:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

In CI, set `NODE_AUTH_TOKEN` to `${{ secrets.GITHUB_TOKEN }}` (the default token has `read:packages` scope when `permissions.packages: read` is set).

Locally, generate a Personal Access Token with `read:packages` and put it in `~/.npmrc` or export it as `NODE_AUTH_TOKEN`.

### Install configs

```sh
pnpm add -D \
  @kin0992/tsconfig \
  @kin0992/eslint-config \
  @kin0992/prettier-config \
  @kin0992/vitest-config
```

### Wire them up

`tsconfig.json`:

```jsonc
{ "extends": "@kin0992/tsconfig/library" }
```

`eslint.config.js`:

```js
import config from '@kin0992/eslint-config';
export default config;
```

`package.json`:

```json
{ "prettier": "@kin0992/prettier-config" }
```

`vitest.config.ts`:

```ts
export { default } from '@kin0992/vitest-config/node';
```

### Install AI Skills

```sh
pnpm add -D @kin0992/skills
```

Skills live as `SKILL.md` files under `node_modules/@kin0992/skills/src/<name>/SKILL.md` and can be loaded by your AI tooling of choice.

---

## 3. Recommended consumer workflow setup

In each consumer repo, add a Renovate or Dependabot config that bumps `@kin0992/*` automatically so updates flow with minimal effort.

`.github/dependabot.yml` example:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: '/'
    schedule: { interval: weekly }
    allow:
      - dependency-name: '@kin0992/*'
```
