# engineering-skills

Plugin bundling AI Skills for engineering workflows, distributed via the
[`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Skills

| Skill                | What it does                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `review-pr-comments` | Evaluate unresolved PR feedback, record decisions, and propose replies that require explicit approval. |

The complete skill and references ship under `skills/review-pr-comments/`.
No separate Humanizer installation, npm package, or build step is required.
Writing improvements happen before approval; approved reply text is not
silently rewritten. Accepting feedback does not authorize implementation or
publication.

Maintainers edit `packages/skills/src/engineering/review-pr-comments/` and
`packages/skills/shared/writing-quality.md`, then run `pnpm skills:sync`.
The npm package and plugin are generated from those sources.

## Install

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install engineering-skills@dev-toolkit
```

The skill requires only an authenticated `gh` CLI session with access to the
target pull request. The plugin does not install or authenticate `gh`.
For VS Code and Claude Code, use the
[native client installation routes](../../CONSUMING.md#3-ai-skills-via-the-dev-toolkit-marketplace);
Copilot CLI is not required.

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
