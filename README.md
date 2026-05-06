# dev-toolkit

Platform Engineering toolkit: reusable GitHub Actions, AI Skills, and shared TypeScript configs that every new project of mine should inherit from a single source of truth.

## What's inside

| Path                                    | Description                                                     |
| --------------------------------------- | --------------------------------------------------------------- |
| `.github/workflows/static-analysis.yml` | Reusable workflow: build, lint, typecheck, format check, tests  |
| `.github/workflows/release.yml`         | Reusable workflow: Changesets versioning and npm publish        |
| `.github/workflows/iac-drift.yml`       | Reusable workflow: Pulumi drift detection                       |
| `.github/actions/setup`                 | Composite action: Node + pnpm + cache                           |
| `packages/tsconfig`                     | `@kin0992/tsconfig` — base / node / library presets             |
| `packages/oxc-config`                   | `@kin0992/oxc-config` — shared OXC format + lint config         |
| `packages/vitest-config`                | `@kin0992/vitest-config` — shared Vitest preset                 |
| `packages/skills`                       | `@kin0992/skills` — AI Skills (commit, PR, review, changelog)   |
| `plugins/git-skills`                    | Copilot/Claude plugin: `commit-message`, `pr-title-description` |
| `plugins/review-skills`                 | Copilot/Claude plugin: `code-review`, `changelog-summary`       |
| `.github/plugin/marketplace.json`       | Marketplace registry exposing the plugins above                 |

## Stack

Node.js 24 · TypeScript · pnpm workspaces · Turbo · OXC (`oxfmt`, `oxlint`) · Vitest · Pulumi (TS) · Changesets · GitHub Actions · GitHub Packages registry

## How to consume from another project

See [CONSUMING.md](./CONSUMING.md).

## Development

```sh
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm format:check
```

### Adding a changeset

```sh
pnpm changeset
```

Commit the generated file with your PR. On merge to `main`, the `release` workflow opens a "Version Packages" PR; merging that PR publishes to GitHub Packages.

## License

MIT — see [LICENSE](./LICENSE).
