---
name: pr-title-description
description: Generate a pull request title and description from a branch's commits, diff, and optional PR template. Use this skill when a PR needs a concise title and a reviewer-friendly description.
license: MIT
---

# Generate a PR title and description

Use this skill to summarize a branch for reviewers with a concise PR title
and a clear markdown description.

## Inputs

- `commits`: list of commit messages on the branch (from `git log base..head`).
- `diff`: full or summarized diff against the base branch.
- `template` (optional): the repo's PR template content.

## Instructions

1. Read the commits, diff, and optional template before writing.
2. Write a **title** that:
   - uses the imperative mood
   - stays within 72 characters
   - summarizes the primary user-facing change
3. If the branch includes multiple themes, choose the dominant one for the
   title and cover the rest in the description.
4. If a PR template is provided, fill its sections instead of inventing a
   different structure.
5. If no template is provided, write a markdown description using these
   sections and omit empty ones:
   - **Why** - motivation, user problem, or linked context
   - **What** - concise bullets grouped by area, not by file
   - **How to verify** - manual checks or tests reviewers should inspect
   - **Risks / follow-ups** - anything reviewers should watch closely
6. Do not duplicate the diff. Describe the intent, outcome, and notable
   reviewer context instead of narrating every edit.
7. Never fabricate ticket numbers, links, screenshots, or validation
   steps.

## Output

Return only the PR title and description.

```text
TITLE: <pr title>

<description in markdown>
```

## Example

Input summary:

- Commits add retry handling for webhook delivery failures
- Diff adds retry metrics and updates docs

Output:

```text
TITLE: Add retry handling for webhook delivery

## Why

Webhook delivery could fail permanently after transient outages, which
made downstream processing unreliable.

## What

- retry failed webhook deliveries before marking them as failed
- emit metrics for retry attempts and exhausted retries
- document the retry behavior for operators

## How to verify

- review the retry path tests
- confirm metrics are emitted for retries and terminal failures

## Risks / follow-ups

- monitor retry volume after rollout to confirm the backoff is tuned well
```

## Common edge cases

- If a template includes required headings, preserve them even when you
  would normally choose a different structure.
- If the diff is broad, group the description by reviewer-relevant areas
  instead of listing files.
- If verification details are missing, do not invent tests or manual
  steps.
