# @kin0992/skills

AI Skills used across projects: prompt-driven helpers for commit messages, PR title/description, code review, and changelog summaries.

Each skill is a folder under `src/` containing a `SKILL.md` (the prompt/instructions) plus optional supporting assets.

## Skills

- `commit-message` — Generate a clear commit message from a staged diff (no Conventional Commits required).
- `pr-title-description` — Generate a PR title and description from the diff and commit log.
- `code-review` — High signal-to-noise PR code review focused on bugs, security, and logic.
- `changelog-summary` — Summarize a list of merged PRs into a human-readable changelog entry.

## Install

```sh
pnpm add -D @kin0992/skills
```

## Use

Resolve a skill's prompt via the package exports:

```ts
import url from 'node:url';
const skillUrl = import.meta.resolve('@kin0992/skills/commit-message');
const path = url.fileURLToPath(skillUrl);
```

Or read it directly from `node_modules/@kin0992/skills/src/<skill>/SKILL.md`.
