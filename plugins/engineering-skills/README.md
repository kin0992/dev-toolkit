# engineering-skills

Plugin bundling AI Skills for engineering workflows, distributed via the
[`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Skills

| Skill                | What it does                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `review-pr-comments` | Evaluate unresolved PR feedback, record decisions, and propose replies that require explicit approval. |

The source lives at
`packages/skills/src/engineering/review-pr-comments/` and is shared by the npm
package and this plugin.

## Install

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install engineering-skills@dev-toolkit
```

The skill requires Python 3.10 or newer and an authenticated `gh` CLI session
with access to the target pull request.

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
