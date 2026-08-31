# Consuming dev-toolkit from another repository

`dev-toolkit` is a **public** repository distributed via three complementary channels:

1. **Reusable GitHub workflows & composite actions** — referenced by path/ref. Pin to `main` for rolling updates or to a tag (e.g. `v1`) for stability.
2. **AI Skills marketplace** — install one plugin per category into Claude Code, Copilot CLI, or VS Code. No auth required.
3. **npm packages on npmjs.org** — public packages under the `@kin0992` scope, published with provenance. No auth required to install.

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
      working-directory: '.'
```

**Note:** The workflow reads your repository's `.node-version` file automatically. Ensure it exists at the root and contains the Node.js version you want to use (e.g., `24.15.0`).

### Release (Changesets + npm publish)

Consumers call the reusable workflow `release-reusable.yml`. `release.yml` in this repo is a thin local entry-point — do not reference it from another repository.

Publishing uses **npm Trusted Publishing** (OIDC): the workflow exchanges the job's `id-token` for a short-lived npmjs.org credential and npm signs **provenance** automatically. No npm token is stored or passed. Each published package needs a Trusted Publisher configured on npmjs.org (see Prerequisites).

If your `release` script only creates git tags (e.g. `changeset git-tag`) and never runs `npm publish`, none of the npm / Trusted-Publishing setup applies.

```yaml
name: Release
on:
  push: { branches: [main] }
  workflow_dispatch:

jobs:
  release:
    permissions:
      contents: write
      pull-requests: write
      id-token: write # required for Trusted Publishing + provenance
    uses: kin0992/dev-toolkit/.github/workflows/release-reusable.yml@main
    # provenance defaults to true; pass `provenance: false` to opt out
    secrets:
      app_id: ${{ secrets.APP_ID }}
      app_private_key: ${{ secrets.APP_PRIVATE_KEY }}
```

**Inputs:**

| Input        | Required | Default | Description                                            |
| ------------ | -------- | ------- | ------------------------------------------------------ |
| `provenance` | no       | `true`  | Publish with npm provenance (needs `id-token: write`). |

**Secrets:**

| Secret            | Required | Description                                            |
| ----------------- | -------- | ------------------------------------------------------ |
| `app_id`          | yes      | GitHub App client ID used to mint a token for git ops. |
| `app_private_key` | yes      | GitHub App private key (PEM).                          |

**Prerequisites:**

- Install `@changesets/cli@^3`. The reusable workflow uses
  `changesets/action@v2`, which does not support Changesets CLI v2.
- Your `package.json` must define `release` and `version-packages` scripts.
  Use `changeset publish` when publishing packages, or `changeset git-tag` for
  a tag-only repository.
- The workflow uses a **GitHub App token** for all git operations. This ensures that tags pushed by the release workflow trigger downstream workflows (e.g. `deploy.yml`), which `GITHUB_TOKEN` cannot do.
  - Create a GitHub App with `contents: write` and `pull-requests: write` permissions on your repository.
  - Add `APP_ID` (the numeric App ID — used as `client-id`) and `APP_PRIVATE_KEY` (the PEM private key) as repository secrets.
  - Install the GitHub App on the repository.
- For publishing to npmjs.org, configure **Trusted Publishing** once per package: on npmjs.org open the package → **Settings → Trusted Publisher → GitHub Actions**, and set the owner/repo to your consumer repo and the workflow filename to your release workflow (e.g. `release.yml`). No npm token is needed. (A brand-new package may need an initial token-based publish before a trusted publisher can be attached — see npm's docs.)
- Provenance requires the repository to be **public** and the job to grant `id-token: write`. Each published package should set `"publishConfig": { "access": "public", "provenance": true }`.

### Security analysis (CodeQL + secret scan + pnpm audit)

A reusable workflow that bundles three checks consumer repos commonly want:

```yaml
name: Security
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
  schedule: [{ cron: '0 6 * * 1' }] # weekly Monday

jobs:
  security:
    permissions:
      contents: read
      packages: read
      actions: read
      security-events: write
    uses: kin0992/dev-toolkit/.github/workflows/security-analysis.yml@main
    with:
      working-directory: '.'
      # codeql-languages: 'javascript-typescript'
      # audit-level: 'high'
```

**Inputs:**

| Input               | Required | Default                 | Description                               |
| ------------------- | -------- | ----------------------- | ----------------------------------------- |
| `working-directory` | no       | `.`                     | Path used for `pnpm audit`.               |
| `codeql-languages`  | no       | `javascript-typescript` | Comma-separated CodeQL languages.         |
| `audit-level`       | no       | `high`                  | Minimum severity that fails `pnpm audit`. |

The workflow runs three independent jobs: `CodeQL` (init + autobuild + analyze, results upload as SARIF to code scanning), `Secret scan (trufflehog)` over the full git history with `--only-verified`, and `pnpm audit` against production dependencies. Each job hardens the runner with `step-security/harden-runner` in audit mode.

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

### IaC deploy (Pulumi up)

To run `pulumi up` automatically on pushes to main (or manually):

```yaml
name: IaC Deploy
on:
  push:
    branches: [main]
    paths: ['infra/**']
  workflow_dispatch:

jobs:
  deploy:
    permissions:
      contents: read
      packages: read
      id-token: write
    uses: kin0992/dev-toolkit/.github/workflows/iac-deploy.yml@main
    with:
      stack: kin0992/myapp/prod
      working-directory: infra
      message: 'deploy from CI'
    secrets:
      PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
```

**Inputs:**

| Input               | Required | Default | Description                                        |
| ------------------- | -------- | ------- | -------------------------------------------------- |
| `stack`             | yes      | —       | Pulumi stack name                                  |
| `working-directory` | no       | `infra` | Path to the Pulumi project                         |
| `message`           | no       | `''`    | Message attached to the update for audit trail     |
| `cloud-url`         | no       | `''`    | Self-managed backend URL; omit to use Pulumi Cloud |

### Pinning strategy

| Goal                    | Reference                          |
| ----------------------- | ---------------------------------- |
| Always latest (rolling) | `@main`                            |
| Stable major            | `@v1` (after first tagged release) |
| Reproducible            | `@<commit-sha>`                    |

---

## 2. npm packages from npmjs.org

The `@kin0992/*` packages are published publicly to npmjs.org, so **no
authentication or `.npmrc` configuration is required** to install them — in CI
or locally. They resolve from the default registry like any other public
package.

### Install configs

```sh
pnpm add -D \
  @kin0992/tsconfig \
  @kin0992/oxc-config \
  @kin0992/vitest-config \
  oxfmt \
  oxlint
```

### Wire them up

`tsconfig.json`:

```jsonc
{ "extends": "@kin0992/tsconfig/library" }
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

### Install AI Skills (programmatic / non-Copilot tooling)

> **Note:** For Claude Code / Copilot users, the marketplace install (below) is
> the simpler path — skills auto-load without any `node_modules` plumbing.

```sh
pnpm add -D @kin0992/skills
```

Skills live as `SKILL.md` files under
`node_modules/@kin0992/skills/src/<category>/<skill>/SKILL.md` and can be
loaded by your AI tooling of choice. Resolve them via subpath exports:

```ts
const skillUrl = import.meta.resolve('@kin0992/skills/git/commit-message');
```

For GitHub Copilot CLI, VS Code, and Claude Code, prefer the marketplace channel below — skills auto-load on demand without any `node_modules` plumbing.

---

## 3. AI Skills via the dev-toolkit marketplace

`dev-toolkit` ships a Copilot/Claude **marketplace** at `.github/plugin/marketplace.json` (mirrored at `.claude-plugin/marketplace.json` so Claude Code finds it on the conventional path), exposing skills via **one plugin per category**:

| Plugin               | Category      | Skills                                   |
| -------------------- | ------------- | ---------------------------------------- |
| `git-skills`         | `git`         | `commit-message`, `pr-title-description` |
| `engineering-skills` | `engineering` | `review-pr-comments`                     |

Each category folder under `packages/skills/src/` has a sibling plugin under `plugins/<category>-skills/`. Adding a new category is mechanical: drop the skills in `packages/skills/src/<category>/`, copy `plugins/git-skills/` as a template, and register the new plugin in `.github/plugin/marketplace.json`.

Each plugin ships dual manifests so it works in:

- **GitHub Copilot CLI** and **VS Code** — via `.github/plugin.json`
- **Claude Code** — via `.claude-plugin/plugin.json`

Skills load **on demand**: Copilot/Claude only pull a skill into context when it matches the current task, so installing a plugin has no token cost when its skills are not relevant.

### GitHub Copilot CLI

No authentication is required — `dev-toolkit` is a public repository.

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit
```

To pin to a specific version, push a Git tag from `dev-toolkit` and reference it; otherwise installs track the marketplace's default branch.

Manage installed plugins with:

```sh
copilot plugin list
copilot plugin update git-skills
copilot plugin uninstall git-skills
```

### VS Code

1. Set `chat.plugins.enabled` to `true` in your **user** settings.
2. Add the marketplace to `chat.plugins.marketplaces` (also user-level — workspace settings are not honoured by the preview):

   ```json
   {
     "chat.plugins.marketplaces": ["kin0992/dev-toolkit"]
   }
   ```

3. Browse and install via the Command Palette → **Chat: Plugins**.

### Claude Code

Claude Code fetches the marketplace from `.claude-plugin/marketplace.json` in this public repo — no auth needed. The simplest setup is to add it to your project's `.claude/settings.json` so every collaborator gets it automatically:

```json
{
  "extraKnownMarketplaces": {
    "dev-toolkit": {
      "source": { "source": "github", "repo": "kin0992/dev-toolkit" }
    }
  },
  "enabledPlugins": {
    "git-skills@dev-toolkit": true
  }
}
```

Commit that file and every contributor who opens the project in Claude Code will have `git-skills` available after accepting the one-time trust prompt.

Alternatively, add the marketplace interactively:

```sh
# inside Claude Code
/plugin marketplace add kin0992/dev-toolkit
/plugin install git-skills@dev-toolkit
```

### Choosing between npm and the marketplace

| Use case                                                                        | Recommended channel                         |
| ------------------------------------------------------------------------------- | ------------------------------------------- |
| GitHub Copilot CLI, Copilot in VS Code, or Claude Code                          | Marketplace (`copilot plugin install`)      |
| Programmatic access to a `SKILL.md` (custom tooling, scripts, other AI clients) | npm (`@kin0992/skills`)                     |
| You want both                                                                   | Both — they share the same `SKILL.md` files |

---

## 4. Recommended consumer workflow setup

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
