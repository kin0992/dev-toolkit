---
name: commit-message
description: |
  **UTILITY SKILL** - Generate a classic Git commit message from a staged diff.
  USE FOR: write commit message, generate commit message from diff, summarize
  staged changes, create commit text, compose git commit.
  DO NOT USE FOR: generating PR descriptions (use pr-title-description),
  writing changelog entries, conventional commits format.
  INVOKES: git diff --staged for reading staged changes.
  FOR SINGLE OPERATIONS: Use git commit -m directly for trivial one-liners.
license: MIT
---

# Generate a classic Git commit message

Turn a staged diff into a classic Git commit message.
Conventional Commits are forbidden.

## Instructions

1. Read the entire diff; identify the _primary intent_ of the change.
2. Write a **subject line**: ≤50 chars, capital start, no period,
   imperative mood, no Conventional Commits prefix (`feat:`, `fix:`…).
3. Prefer specific verbs ("Fix", "Add", "Remove", "Rename", "Refactor").
   Avoid vague verbs like "Update".
4. Add a **body** only when it adds useful context. Separate with a
   blank line, wrap at 72 chars, explain what and why.
5. If the change touches unrelated areas, suggest splitting into
   multiple commits.
6. Never invent issue numbers.

## Output

Return only the commit message text, no commentary or fences.
If a body is needed:

```text
<subject line>

<body>
```

## Example

```text
Guard startup when config is missing

Prevent the app from crashing when optional configuration is absent.
This keeps startup behavior predictable and makes the fallback path
explicit.
```

## Common edge cases

- Small, self-explanatory changes need only a subject line.
- If the diff mixes unrelated changes, recommend splitting into
  separate commits.
