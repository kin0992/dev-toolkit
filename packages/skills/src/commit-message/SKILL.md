---
name: commit-message
description: Generate a classic Git commit message from a staged diff. Use this skill when a concise commit message is needed and Conventional Commits are not allowed.
license: MIT
---

# Generate a classic Git commit message

Use this skill to turn a staged diff into a classic Git commit message.
Conventional Commits are forbidden.

## Inputs

- `diff`: output of `git diff --staged` (or equivalent).
- `context` (optional): branch name, related issue, prior commit messages.

## Instructions

1. Read the entire diff and identify the _primary intent_ of the
   change: what the change accomplishes, not a file-by-file summary.
2. Write a **subject line** that:
   - is 50 characters or fewer
   - starts with a capital letter
   - does not end with a period
   - uses the imperative mood
   - does not use a Conventional Commits prefix such as `feat:`,
     `fix:`, `docs:`, or `chore:`
3. Prefer specific verbs such as "Fix", "Add", "Remove", "Rename",
   "Refactor", or "Document". Avoid vague verbs such as "Update" or
   "Change" unless they are the most accurate choice.
4. Add a **body** only when it adds useful context.
5. When you include a body:
   - separate it from the subject with a single blank line
   - wrap it at 72 characters
   - explain what changed and why
   - avoid narrating how the code was edited unless a non-obvious
     tradeoff or constraint must be called out
6. If the change touches multiple unrelated areas, suggest splitting
   it into multiple commits instead of forcing one broad message.
7. Reference issues only when a reference is provided. Never invent
   issue numbers.

## Output

Return only the commit message text. Do not add commentary or markdown
fences.

- If no body is needed, return only the subject line.
- If a body is needed, use this format:

```text
<subject line>

<body>
```

## Example

Input summary:

- Fixes a crash when configuration is missing
- Clarifies the fallback behavior in related code

Output:

```text
Guard startup when config is missing

Prevent the app from crashing when optional configuration is absent.
This keeps startup behavior predictable and makes the fallback path
explicit for future maintenance.
```

## Common edge cases

- If the change is small and self-explanatory, return only the subject
  line.
- If the diff mixes unrelated changes, recommend splitting it into
  separate commits.
- If an issue reference is not provided, do not invent one.
- If the subject exceeds 50 characters, tighten the wording instead of
  falling back to a Conventional Commits prefix.
