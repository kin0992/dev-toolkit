---
name: branch-name
description: |
  **UTILITY SKILL** - Suggest a Git branch name using activity-type/activity-name.
  USE FOR: name a branch, generate a branch name, pick feature or fix branch names.
  DO NOT USE FOR: commit messages, PR descriptions, releases, or tags.
  INVOKES: nothing — derives names from the supplied task.
  FOR SINGLE OPERATIONS: Use git checkout -b when the name is obvious.
license: MIT
---

# Suggest a Git branch name

Derive `<activity-type>/<activity-name>` from the task description.

## Activity types

| Type        | Use for                                      |
| ----------- | -------------------------------------------- |
| `features`  | New features                                 |
| `fixes`     | Bug fixes, hotfixes, and security patches    |
| `refactors` | Code refactoring and reducing technical debt |
| `chores`    | System tasks that are not user-facing        |
| `docs`      | Documentation-related tasks                  |

## Activity name rules

- Lowercase and hyphen-separated.
- Short and specific; avoid generic names like `update` or `fix`.
- Plural where applicable: `user-notifications`, not `user-notification`.
- Strip tracking IDs such as `PROJ-123`; reference them in the PR instead.

## Instructions

1. Identify the primary intent and pick its activity type.
2. Derive a specific name using the rules above, without invented scope.
3. For unrelated concerns, propose one branch per concern.
4. Before writing multi-branch rationales, read
   [writing quality](references/writing-quality.md). Preserve task facts.
5. Ask for clarification if the task is too vague to name.

## Output

Return only the branch name, no commentary or fences.
If multiple branches are warranted, list one per line with a one-sentence
rationale for each.

## Examples

```text
features/dark-mode-settings
fixes/broken-pagination-links
refactors/auth-token-handlers
chores/dependency-upgrades
docs/api-authentication-guides
```
