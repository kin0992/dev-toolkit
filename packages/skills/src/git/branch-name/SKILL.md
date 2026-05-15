---
name: branch-name
description: |
  **UTILITY SKILL** - Suggest a Git branch name following the <activity-type>/<activity-name> convention.
  USE FOR: name a branch, suggest branch name, create branch name from task description,
  generate git branch name, pick branch name for feature or fix.
  DO NOT USE FOR: writing commit messages (use commit-message), generating PR descriptions
  (use pr-title-description), naming releases or tags.
  INVOKES: nothing — derives the branch name from the task description provided by the user.
  FOR SINGLE OPERATIONS: Use git checkout -b directly when the name is already obvious.
license: MIT
---

# Suggest a Git branch name

Propose a well-formed branch name from a task description, following the
`<activity-type>/<activity-name>` convention.

## Convention

```
<activity-type>/<activity-name>
```

### Activity types

| Type        | Use for                                              |
| ----------- | ---------------------------------------------------- |
| `features`  | New features                                         |
| `fixes`     | Any kind of fix                                      |
| `refactors` | Code refactoring and reducing technical debt         |
| `chores`    | System tasks that are not user-facing                |
| `docs`      | Documentation-related tasks                          |

### Activity name rules

- **Lowercase**, words separated by **hyphens** (`-`).
- **Short and meaningful** — avoid generic words like `update` or `fix`.
- **Plural form** where applicable, similar to naming a folder that groups
  related files (e.g., `user-notifications` rather than `user-notification`).
- **No tracking IDs** (e.g., Jira issue keys). Reference them in the PR
  description instead.

## Instructions

1. Identify the primary intent of the task description.
2. Pick the most specific activity type from the table above.
3. Derive a short, descriptive activity name: lowercase, hyphen-separated,
   plural where it makes sense.
4. If the task spans multiple unrelated concerns, suggest splitting into
   separate branches and propose one name per concern.
5. Never invent or include issue/ticket IDs.

## Output

Return only the branch name, no commentary or fences.
If multiple branches are warranted, list one per line with a one-sentence
rationale for each.

## Examples

```text
features/dark-mode-settings
```

```text
fixes/broken-pagination-links
```

```text
refactors/auth-token-handlers
```

```text
chores/dependency-upgrades
```

```text
docs/api-authentication-guides
```

## Common edge cases

- If the task description contains an issue ID (e.g., `PROJ-123`), strip it
  and derive the name solely from the textual description.
- If the description is too vague (e.g., "do the thing"), ask for
  clarification before proposing a name.
- Hotfixes and security patches fall under `fixes`.
