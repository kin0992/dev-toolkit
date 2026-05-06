# review-skills

Plugin bundling AI Skills for code review and release summarization,
distributed via the [`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Skills

| Skill               | What it does                                                                            |
| ------------------- | --------------------------------------------------------------------------------------- |
| `code-review`       | High signal-to-noise PR code review focused on bugs, security issues, and logic errors. |
| `changelog-summary` | Summarize a list of merged PRs into a human-readable changelog entry.                   |

The actual `SKILL.md` files live at
`packages/skills/src/<skill-name>/SKILL.md` in this repo and are referenced
from the plugin manifests via relative paths, so the npm package
`@kin0992/skills` and this plugin share a single source of truth.

## Install

From a consumer machine:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install review-skills@dev-toolkit
```

For Claude Code, add the same marketplace; the `.claude-plugin/plugin.json`
manifest is shipped alongside `.github/plugin.json`.

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
