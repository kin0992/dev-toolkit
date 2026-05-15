# Consuming dev-toolkit from another repository

`dev-toolkit` is a **public** repository distributed via three complementary channels:

1. **Reusable GitHub workflows & composite actions** — referenced by path/ref. Pin to `main` for rolling updates or to a tag (e.g. `v1`) for stability.
2. **AI Skills marketplace** — install one plugin per category into Claude Code, Copilot CLI, or VS Code. No auth required.
3. **npm packages on GitHub Packages** — under the `@kin0992` scope. Auth required (GitHub Packages requires a PAT with `read:packages` even for packages from a public repo).

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

To automate versioning and publishing with Changesets:

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
      packages: write
      id-token: write
    uses: kin0992/dev-toolkit/.github/workflows/release.yml@main
    secrets: inherit
```

Your `package.json` must define `release` and `version-packages` scripts, and your repository must publish to the `@kin0992` npm scope (or adjust the `.npmrc` config as needed). The workflow uses Changesets to manage versioning.

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

> **Note:** GitHub Packages requires authentication even for packages from a public repository.
> Marketplace install (below) has no auth requirement and is recommended for Claude Code / Copilot users.

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

| Plugin       | Category | Skills                                   |
| ------------ | -------- | ---------------------------------------- |
| `git-skills` | `git`    | `commit-message`, `pr-title-description` |

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
