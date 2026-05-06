# @kin0992/skills

AI Skills used across projects: prompt-driven helpers for commit messages and PR title/description.

Each skill is a folder under `src/` containing a `SKILL.md` with metadata
and instructions, plus optional supporting assets.

## Skills

- `commit-message` — Generate a clear commit message from a staged diff using classic Git commit style and forbidding Conventional Commits.
- `pr-title-description` — Generate a PR title and description from the diff and commit log.

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

## GitHub Copilot CLI / VS Code / Claude Code

If you use GitHub Copilot CLI, Copilot in VS Code, or Claude Code, prefer the
**marketplace channel**, which auto-loads these same `SKILL.md` files on
demand without any `node_modules` plumbing:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit     # commit-message, pr-title-description
```

See [CONSUMING.md](../../CONSUMING.md#3-ai-skills-via-the-dev-toolkit-marketplace) for the full setup, including VS Code and Claude Code.
