# dev-toolkit

Platform Engineering toolkit: reusable GitHub Actions, AI Skills, and shared TypeScript configs that every new project of mine should inherit from a single source of truth.

## What's inside

| Path                                    | Description                                                    |
| --------------------------------------- | -------------------------------------------------------------- |
| `.github/workflows/static-analysis.yml` | Reusable workflow: build, lint, typecheck, format check, tests |
| `.github/workflows/iac-drift.yml`       | Reusable workflow: Pulumi drift detection                      |
| `.github/actions/setup`                 | Composite action: Node + pnpm + cache                          |
| `packages/tsconfig`                     | `@kin0992/tsconfig` — base / node / library presets            |
| `packages/eslint-config`                | `@kin0992/eslint-config` — flat ESLint config for TS           |
| `packages/prettier-config`              | `@kin0992/prettier-config` — shared Prettier config            |
| `packages/vitest-config`                | `@kin0992/vitest-config` — shared Vitest preset                |
| `packages/skills`                       | `@kin0992/skills` — AI Skills (commit, PR, review, changelog)  |

## Stack

Node.js LTS · TypeScript · pnpm workspaces · Turbo · Vitest · Pulumi (TS) · Changesets · GitHub Actions · GitHub Packages registry

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
