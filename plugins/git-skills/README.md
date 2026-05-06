# git-skills

Plugin bundling AI Skills for git workflow automation, distributed via the
[`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Skills

| Skill                  | What it does                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `commit-message`       | Generate a classic Git commit message from a staged diff (no Conventional Commits). |
| `pr-title-description` | Generate a PR title and description from a diff and commit log.                     |

The actual `SKILL.md` files live at
`packages/skills/src/<skill-name>/SKILL.md` in this repo and are referenced
from the plugin manifests via relative paths, so the npm package
`@kin0992/skills` and this plugin share a single source of truth.

## Install

From a consumer machine:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit
```

For Claude Code, add the same marketplace; the `.claude-plugin/plugin.json`
manifest is shipped alongside `.github/plugin.json`.

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
