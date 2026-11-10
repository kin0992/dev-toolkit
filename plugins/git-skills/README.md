# git-skills

Plugin bundling AI Skills for git workflow automation, distributed via the
[`dev-toolkit` marketplace](../../.github/plugin/marketplace.json).

## Skills

| Skill                  | What it does                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `commit-message`       | Generate a classic Git commit message from a staged diff (no Conventional Commits). |
| `pr-title-description` | Generate a PR title and description from a diff and commit log.                     |
| `branch-name`          | Suggest a branch name following the `<activity-type>/<activity-name>` convention.   |

This plugin contains complete skill directories under `skills/`, including
their writing guides. Both manifests reference only these plugin-local files;
installation needs no source-monorepo access or build step.

Maintainers edit `packages/skills/src/git/` and
`packages/skills/shared/writing-quality.md`, then run `pnpm skills:sync`.
The npm package and this plugin are generated from the same sources.

No separate Humanizer installation is required. The bundled policy keeps
commit and PR prose concrete without changing Git formats or adding
commentary to branch names. Git must already be installed for diff/history
commands; branch naming alone needs no external tool.

This is the `git` category plugin. The repository follows a
**one-plugin-per-category** convention: each top-level folder under
`packages/skills/src/` (e.g. `git/`, `engineering/`, `productivity/`) has a
sibling plugin under `plugins/<category>-skills/` that exposes its skills on
the marketplace.

## Install

`dev-toolkit` is a public repository — no authentication required.

**Copilot CLI:**

```sh
copilot plugin marketplace add kin0992/dev-toolkit
copilot plugin install git-skills@dev-toolkit
```

**VS Code:** use its native plugin settings and install UI; Copilot CLI is not
required. See [client setup](../../CONSUMING.md#vs-code).

**Claude Code (project-level, shared with all contributors):**

Add to `.claude/settings.json` in your consumer repo:

```json
{
  "extraKnownMarketplaces": {
    "dev-toolkit": {
      "source": { "source": "github", "repo": "kin0992/dev-toolkit" }
    }
  },
  "enabledPlugins": { "git-skills@dev-toolkit": true }
}
```

**Claude Code (interactive):**

```sh
/plugin marketplace add kin0992/dev-toolkit
/plugin install git-skills@dev-toolkit
```

## Manifests

- `.github/plugin.json` — Copilot CLI + VS Code
- `.claude-plugin/plugin.json` — Claude Code
