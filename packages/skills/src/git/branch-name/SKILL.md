---
name: branch-name
description: |
  **UTILITY SKILL** - Suggest a Git branch name following the <activity-type>/<activity-name> convention.
  USE FOR: name a branch, suggest or generate a branch name from a task description.
  DO NOT USE FOR: commit messages (use commit-message), PR descriptions
  (use pr-title-description), releases or tags.
  INVOKES: nothing — derives the name from the user's task description.
  FOR SINGLE OPERATIONS: Use git checkout -b directly when the name is obvious.
license: MIT
---

# Suggest a Git branch name

Derive `<activity-type>/<activity-name>` from the task description.

## Activity types

| Type        | Use for                                       |
| ----------- | --------------------------------------------- |
| `features`  | New features                                  |
| `fixes`     | Any fix, including hotfixes and security ones |
| `refactors` | Refactoring and reducing technical debt       |
| `chores`    | System tasks that are not user-facing         |
| `docs`      | Documentation                                 |

## Activity name

- Lowercase, hyphen-separated, short and specific (not `update` or `fix`).
- Plural where it fits, like a folder grouping related files
  (`user-notifications`, not `user-notification`).
- Built from the description text alone: strip issue keys such as `PROJ-123`;
  they belong in the PR description.

## Instructions

1. Pick the most specific activity type for the task's primary intent.
2. If the description is too vague to name (e.g. "do the thing"), ask for
   clarification first.
3. If the task spans unrelated concerns, propose one branch per concern.

## Output

Only the branch name, with no commentary or fences. For multiple branches,
one per line, each with a one-sentence rationale.

## Examples

```text
features/dark-mode-settings
fixes/broken-pagination-links
refactors/auth-token-handlers
chores/dependency-upgrades
docs/api-authentication-guides
```
