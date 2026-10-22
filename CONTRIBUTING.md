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

The aggregate `pnpm code-review` script runs formatting, type checking,
linting, tests, and marketplace/payload drift checks. Pass it locally before
pushing.

## Changesets

Any change that affects a published `@kin0992/*` package must include a
changeset:

```sh
pnpm changeset
```

Commit the generated file with your PR. On merge to `main`, the release
workflow opens a "Version Packages" PR; merging that PR publishes the
`@kin0992/*` packages to the public npm registry (npmjs.org) with provenance.

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
- Self-references to actions in this same repository
  (`kin0992/dev-toolkit/.github/actions/*`) intentionally stay on `@main`
  rather than a pinned SHA. The supply-chain trust boundary does not exist
  (we control both ends), Dependabot cannot bump same-repo references, and
  SHA-pinning would force a manual two-step on every change to the action.
  OpenSSF Scorecard's `Pinned-Dependencies` check flags these and they are
  dismissed as `won't fix`.

## Skills and plugins

Canonical skills live under
`packages/skills/src/<category>/<skill>/SKILL.md`. The original shared policy
is `packages/skills/shared/writing-quality.md`; it is not a discoverable skill.
Edit these sources, not generated copies.

`pnpm skills:sync` copies the guide into every exported skill's
`references/writing-quality.md`, materializes complete regular-file payloads
under `plugins/<category>-skills/skills/`, and updates the marked policy block
in the Triage agent. All generated files are committed so consumers need
neither pnpm nor a build step. Other Triage instructions, plugin READMEs, and
manifests remain handwritten.

```sh
pnpm skills:sync
pnpm skills:check
pnpm test:skills
```

Check mode is read-only and fails on missing files, drift, invalid component
paths, or missing/escaping local Markdown resources. Sync does not silently
delete stale files: review and explicitly remove obsolete generated files,
then rerun it.

To add a skill:

1. Create `src/<category>/<skill>/SKILL.md` and any local references.
2. Export it from `packages/skills/package.json` using the existing
   `./<category>/<skill>` convention.
3. Explicitly read `references/writing-quality.md` before drafting prose;
   preserve the skill's output format and approval rules inline. Branch-only
   output does not need a prose pass.
4. Register its plugin-local path in both plugin manifests. For a new category,
   create `plugins/<category>-skills/` and add its source to
   `.github/plugin/marketplace.json`.
5. Run `pnpm skills:sync`, then the checks above. Do not edit the
   `.claude-plugin/marketplace.json` symlink separately.
6. Add a package changeset, bump affected plugin versions in both manifests,
   and run `pnpm marketplace:sync`.

The single policy source is inspired by Humanizer, but does not copy its
instructions or require its installation. Keep it technical and neutral;
do not add a global rewriting hook or polish already-approved text.

`waza` enforces 500 tokens per `SKILL.md` and 1,000 per reference through
`.waza.yaml`. The eval workflow covers skill, plugin, generator, and evaluation
changes. Its mock suites test harness plumbing only; see
[evals/README.md](./evals/README.md) for opt-in live quality checks, comparisons,
and approval-sensitive client scenarios.

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
