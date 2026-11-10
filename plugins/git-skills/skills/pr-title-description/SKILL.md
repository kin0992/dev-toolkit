---
name: pr-title-description
description: |
  **UTILITY SKILL** - Generate a pull request title and description from a branch diff.
  USE FOR: write PR description, generate pull request title, summarize branch
  for reviewers, create PR body from commits, draft pull request.
  DO NOT USE FOR: writing commit messages (use commit-message skill),
  code review feedback, changelog generation.
  INVOKES: git log and git diff for reading branch changes, file reading for PR templates.
  FOR SINGLE OPERATIONS: Use git log --oneline directly for a quick branch summary.
license: MIT
---

# Generate a PR title and description

Summarize a branch for reviewers with a concise PR title and markdown
description.

Before drafting, read [writing quality](references/writing-quality.md).
Keep claims grounded in the branch evidence; preserve templates and output.

## Instructions

1. Read commits, diff, and optional template before writing.
2. Write a **title**: imperative mood, ≤72 chars, summarizing the
   primary user-facing change.
3. If a PR template is provided, fill its sections. Otherwise use:
   - **Why** – motivation or linked context
   - **What** – concise bullets grouped by area
   - **How to verify** – checks or tests for reviewers
   - **Risks / follow-ups** – anything to watch closely
     Omit empty sections.
4. Describe intent and outcome, not every edit. Never fabricate ticket
   numbers, links, or steps.
5. Distinguish checks actually run from suggested verification. If a required
   section lacks evidence, say it is not verified; never mark a check complete.

## Output

Return only the title and description:

```text
TITLE: <pr title>

<description in markdown>
```

## Example

```text
TITLE: Add retry handling for webhook delivery

## Why
A failed request previously ended delivery without another attempt.

## What
- make up to three delivery attempts for unsuccessful responses
- count delivered, retried, and exhausted deliveries

## How to verify
Not run. Suggested: return non-2xx responses and confirm delivery stops
after three attempts.
```

## Common edge cases

- If a template includes required headings, preserve them.
- Omit unsupported optional verification; keep required template sections
  and identify missing evidence.
