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
        └── SKILL.md      # frontmatter + instructions, optional assets
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
  review threads and record accept, defer, or ignore decisions with reactions.

## Install (npm, programmatic)

```sh
pnpm add -D @kin0992/skills
```

Resolve a skill's prompt via the package exports:

```ts
import url from 'node:url';
const skillUrl = import.meta.resolve('@kin0992/skills/git/commit-message');
const path = url.fileURLToPath(skillUrl);
```

Or read it directly from
`node_modules/@kin0992/skills/src/<category>/<skill>/SKILL.md`.

## Install (GitHub Copilot CLI / VS Code / Claude Code)

Prefer the **marketplace channel** — `SKILL.md` files auto-load on demand,
no `node_modules` plumbing:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit      # commit-message, pr-title-description
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
4. Add a changeset describing the new skill.
