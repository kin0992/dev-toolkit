# Consuming dev-toolkit from another repository

`dev-toolkit` is distributed via two complementary channels:

1. **Reusable GitHub workflows & composite actions** — referenced by path/ref. Pin to `main` for rolling updates or to a tag (e.g. `v1`) for stability.
2. **npm packages on GitHub Packages** — under the `@kin0992` scope. Use `latest` or caret ranges to inherit minor/patch updates.

---

## Requirements

Before consuming any reusable workflow from `dev-toolkit`, your repository must meet these prerequisites.

### Package manager: pnpm

All workflows use **pnpm** exclusively. Your consumer repository must:

- Use pnpm as its package manager (not npm or yarn).
- Declare the exact pnpm version in the `packageManager` field of your root `package.json`. The `setup` composite action reads this field to install the correct pnpm version.

  ```json
  { "packageManager": "pnpm@10.x.x+sha512.<hash>" }
  ```

  Generate the correct value locally with `corepack use pnpm@latest`.

### `code-review` script

The static analysis workflow runs a single command: `pnpm code-review`. Your root `package.json` must define this script. A recommended implementation:

```json
{
  "scripts": {
    "code-review": "pnpm turbo run format:check typecheck lint test"
  }
}
```

Adapt the script body to your project's toolchain (add other turbo tasks if needed, add `build` if required, etc.).

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
    permissions:
      contents: read
      packages: read
    uses: kin0992/dev-toolkit/.github/workflows/static-analysis.yml@main
    with:
      node-version: '22'
      working-directory: '.'
```

### IaC drift detection (Pulumi)

```yaml
name: IaC Drift
on:
  schedule: [{ cron: '0 6 * * *' }]
  pull_request:
    paths: ['infra/**']

jobs:
  drift:
    permissions:
      contents: read
      packages: read
      id-token: write
      pull-requests: write
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

`dev-toolkit`'s shared setup action also forwards a token to pnpm-related steps as
`NODE_AUTH_TOKEN`, defaulting to `github.token`. If you override job
permissions in a caller workflow, keep `packages: read` available or private
`@kin0992/*` installs will still fail.

Locally, generate a Personal Access Token with `read:packages` and put it in `~/.npmrc` or export it as `NODE_AUTH_TOKEN`.

### Install configs

```sh
pnpm add -D \
  @kin0992/tsconfig \
  @kin0992/oxc-config \
  @kin0992/eslint-config \
  @kin0992/vitest-config \
  oxfmt \
  oxlint
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

`oxfmt.config.ts`:

```ts
import config from '@kin0992/oxc-config/oxfmt';
export default config;
```

`oxlint.config.ts`:

```ts
import config from '@kin0992/oxc-config/oxlint';
export default config;
```

`package.json`:

```json
{
  "scripts": {
    "format": "oxfmt",
    "format:check": "oxfmt --check",
    "lint:oxlint": "oxlint ."
  }
}
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

### Legacy formatter package

`@kin0992/prettier-config` is still available for existing consumers, but new projects should prefer `@kin0992/oxc-config`.

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
