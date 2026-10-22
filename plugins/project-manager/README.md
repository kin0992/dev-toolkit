# project-manager

Plugin bundling project management agents for GitHub-based workflows, distributed
via the [`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Agents

| Agent    | What it does                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `triage` | Capture rough ideas / bugs / improvements as well-formed GitHub issues, attach them to a GitHub Project (v2) board, and transition existing items through their lifecycle. |

The agent talks to GitHub through the `gh` CLI (and `gh api graphql` for the
parts of GitHub Projects v2 that the CLI doesn't cover yet). Install and
authenticate `gh` separately with the permissions listed below.

The agent includes the same compact writing policy as the toolkit's skills.
No Humanizer install, npm package, or build step is needed. Drafts stay factual
and direct; the agent still needs explicit confirmation before any GitHub
mutation and publishes only approved text.

Maintainers edit the agent's handwritten instructions here and the shared
policy at `packages/skills/shared/writing-quality.md`. Run `pnpm skills:sync`
to update the marked policy block rather than editing that block by hand.

## Install

From a consumer machine:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install project-manager@dev-toolkit
```

For Claude Code, add the same marketplace; the `.claude-plugin/plugin.json`
manifest is shipped alongside `.github/plugin.json`. For VS Code and Claude
Code, follow [native client setup](../../CONSUMING.md#3-ai-skills-via-the-dev-toolkit-marketplace);
Copilot CLI is not required.

## Usage

Select the Triage agent in your client's agent picker. In Copilot CLI, start
a session inside the target repository with the plugin-qualified name:

```sh
copilot --agent project-manager:triage
```

Then either describe a rough idea / bug ("capture" mode) or reference an
existing issue and a target column ("transition" mode):

```
You> the export button is missing on the reports page in dark mode
You> move #198 to in review
```

The agent will ask the minimum questions it needs, show you a preview, and
only mutate GitHub or the project board after explicit confirmation.

## Requirements

- `gh` CLI installed and authenticated with `repo`, `project`, and
  `read:project` scopes (`gh auth refresh -s project,read:project`).
- A GitHub Project (v2) board on the target owner/org. Classic Projects are
  not supported.

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
