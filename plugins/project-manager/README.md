# project-manager

Plugin bundling project management agents for GitHub-based workflows, distributed
via the [`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Agents

| Agent    | What it does                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `triage` | Capture rough ideas / bugs / improvements as well-formed GitHub issues, attach them to a GitHub Project (v2) board, and transition existing items through their lifecycle. |

The agent talks to GitHub through the `gh` CLI (and `gh api graphql` for the
parts of GitHub Projects v2 that the CLI doesn't cover yet), so it works
locally and in CI without extra plumbing.

## Install

From a consumer machine:

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install project-manager@dev-toolkit
```

For Claude Code, add the same marketplace; the `.claude-plugin/plugin.json`
manifest is shipped alongside `.github/plugin.json`.

## Usage

In a chat session inside any repository:

```
/agent triage
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
