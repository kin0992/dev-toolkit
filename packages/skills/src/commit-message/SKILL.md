# Skill: commit-message

Generate a concise, informative Git commit message from a staged diff. No Conventional Commits prefix required.

## Inputs

- `diff`: output of `git diff --staged` (or equivalent).
- `context` (optional): branch name, related issue, prior commit messages.

## Instructions

1. Read the entire diff. Identify the _primary intent_ of the change (what the user is trying to accomplish, not a file-by-file enumeration).
2. Write a **subject line** in the imperative mood, ≤ 72 characters, no trailing period. Avoid filler verbs ("Update", "Change") unless that is genuinely the action; prefer specific verbs ("Fix", "Add", "Remove", "Rename", "Refactor", "Document").
3. Add a blank line, then a **body** (optional, only if it adds value): explain _why_ the change is being made and any non-obvious decisions. Wrap at 72 chars. Use bullets for multiple unrelated points.
4. If the change touches multiple unrelated areas, suggest splitting into multiple commits instead of writing a sprawling message.
5. Reference issues only when a reference is provided; never invent issue numbers.

## Output Format

```
<subject line>

<optional body>
```

Return only the commit message text. No commentary, no markdown fences.
