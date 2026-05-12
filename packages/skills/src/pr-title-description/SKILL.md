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
Transient outages could permanently fail webhook delivery.

## What
- retry failed deliveries before marking them failed
- emit retry metrics
- document retry behavior

## How to verify
- review retry path tests
- confirm metrics for retries and terminal failures
```

## Common edge cases

- If a template includes required headings, preserve them.
- If verification details are missing, do not invent steps.
