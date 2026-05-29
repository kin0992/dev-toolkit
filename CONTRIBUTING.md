# Contributing to dev-toolkit

Thanks for taking the time to contribute. This repo is the single source of
truth for Platform Engineering tooling consumed by other `kin0992` projects, so
changes are held to a higher reliability bar than typical app code.

## Prerequisites

- Node.js per `.node-version`.
- pnpm at the version pinned in `package.json#packageManager` — install via
  `corepack enable && corepack use pnpm@latest` or rely on Corepack auto-install.

## Local development

```sh
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm format:check
```

The aggregate `pnpm code-review` script (`format:check`, `typecheck`,
`lint:check`, `test`) is what CI runs — pass it locally before pushing.

## Changesets

Any change that affects a published `@kin0992/*` package must include a
changeset:

```sh
pnpm changeset
```

Commit the generated file with your PR. On merge to `main`, the release
workflow opens a "Version Packages" PR; merging that PR publishes to GitHub
Packages.

Changes scoped purely to `infra/`, workflows, docs, or the marketplace
manifests do not need a changeset.

## Reusable workflows and composite actions

These are consumed by other repositories at `@main`, so breaking changes ripple
immediately. When changing anything under `.github/workflows/` or
`.github/actions/`:

- Keep inputs additive when possible; never remove or rename an input without
  a major version cut.
- Update `CONSUMING.md` in the same PR.
- Pin third-party actions by commit SHA, with the tag as a trailing comment
  (e.g. `actions/checkout@<sha> # 6.0.2`). This matches the existing style and
  is required for supply-chain hardening.

## Skills and plugins

Skills live under `packages/skills/src/<category>/<skill>/SKILL.md`. Each
category has a sibling plugin under `plugins/<category>-skills/`. To add a
new category:

1. Drop the skills in `packages/skills/src/<new-category>/`.
2. Copy `plugins/git-skills/` as a template.
3. Register the plugin in `.github/plugin/marketplace.json` and
   `.claude-plugin/marketplace.json`.

`waza` enforces SKILL token budgets via `.waza.yaml`; the eval workflow runs
on PRs that touch skills or evals.

## Infrastructure

The Pulumi program in `infra/` manages this repository's own GitHub settings.
Any change to repo settings (branch protection, security features, topics)
must go through Pulumi — do not change them in the UI.

## Reporting security issues

See [SECURITY.md](./SECURITY.md). Do not file security-sensitive reports as
public issues or PRs.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE).
