# @kin0992/skills

A pluggable catalog of AI Skills used across my projects — prompt-driven
helpers that any agent that understands the [Agent Skills](https://github.blog/changelog/2025-09-17-skills-coming-to-github-copilot/)
spec can load on demand.

## Layout

Skills are organized by **category**:

```
packages/skills/src/
└── <category>/
    └── <skill>/
        ├── SKILL.md
        └── references/   # bundled writing guide and skill-specific resources
```

Each `<category>` maps 1:1 to a marketplace plugin under
`plugins/<category>-skills/` so users can install only the categories they
care about.

## Skills

### `git/`

- `commit-message` — Generate a clear commit message from a staged diff using
  classic Git commit style (Conventional Commits forbidden).
- `pr-title-description` — Generate a PR title and description from the diff
  and commit log.
- `branch-name` — Suggest a branch name using the repository's activity naming
  convention.

### `engineering/`

- `review-pr-comments` — Evaluate every actionable comment in unresolved PR
  review threads and record Accept, Defer, or Reject decisions. Implementation
  and publication require separate explicit approval.

Each skill includes a compact, original technical-writing guide inspired by
[Humanizer](https://github.com/blader/humanizer). No Humanizer installation or
additional writing package is required. The guide applies to this skill's
prose; it does not globally rewrite conversations or change approved replies.

## Install (npm, programmatic)

```sh
pnpm add -D @kin0992/skills
```

Resolve a skill's prompt via the package exports:

```ts
import url from 'node:url';
const skillUrl = import.meta.resolve('@kin0992/skills/git/commit-message');
const path = url.fileURLToPath(skillUrl);
const writingGuideUrl = new URL('./references/writing-quality.md', skillUrl);
```

Or read it directly from
`node_modules/@kin0992/skills/src/<category>/<skill>/SKILL.md`.
Keep the skill's directory and relative references available to your loader.
Loading only the entrypoint's text does not automatically load those resources.
Existing Git and `gh` prerequisites are not npm dependencies and are not
installed by this package.

## Install (GitHub Copilot CLI / VS Code / Claude Code)

Prefer the **marketplace channel** — `SKILL.md` files auto-load on demand,
no `node_modules` plumbing:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit      # commit-message, pr-title-description, branch-name
copilot plugin install engineering-skills@dev-toolkit # review-pr-comments
```

See [CONSUMING.md](../../CONSUMING.md#3-ai-skills-via-the-dev-toolkit-marketplace)
for VS Code and Claude Code setup.

## Adding a new skill

1. Create `src/<category>/<skill>/SKILL.md` with the standard frontmatter.
2. Add an `exports` entry to `package.json`:
   `"./<category>/<skill>": "./src/<category>/<skill>/SKILL.md"`.
3. If this is a new category, scaffold a sibling plugin under
   `plugins/<category>-skills/` (copy `plugins/git-skills/` as a template),
   then add it to `.github/plugin/marketplace.json`.
4. Register the plugin-local component path in both manifests and explicitly
   apply the local writing reference before drafting prose.
5. Run `pnpm skills:sync` from the repository root. This materializes the
   shared policy and complete plugin payloads as regular files. Do not edit
   generated references or plugin skill copies by hand.
6. Run `pnpm skills:check` and `pnpm test:skills`. Add a changeset, bump affected
   plugin versions in both manifests, and run `pnpm marketplace:sync`.
