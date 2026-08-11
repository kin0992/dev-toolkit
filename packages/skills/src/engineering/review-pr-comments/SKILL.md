---
name: review-pr-comments
description: |
  **INTERACTIVE SKILL** - Evaluate every actionable comment in unresolved
  GitHub PR review threads, including agent comments.
  USE FOR: review unresolved PR comments, triage review threads, process
  Copilot feedback.
  DO NOT USE FOR: general PR comments, resolving threads, unapproved replies.
  INVOKES: gh CLI, including gh api GraphQL and REST calls.
license: MIT
---

# Review unresolved PR comments

## Instructions

1. Read and follow the complete [workflow](references/workflow.md) and
   [`gh` commands](references/gh-commands.md).
2. Process one PR and all actionable comments in its unresolved review threads;
   include bots, but exclude general PR conversation comments.
3. Evaluate each comment against the diff and source context.
4. If there is more than one actionable comment, enter batch triage before
   making any GitHub mutation. Ask one question at a time, and for each comment
   show its recommendation plus a concise suggested reply. Record `Accept` with
   `+1`, `Defer` with `eyes`, and `Reject` with `-1`; do not edit code merely
   because a comment was accepted.
5. Keep every decision and reply draft grouped locally until all actionable
   comments have been triaged. Then show the complete grouped plan and ask for
   one confirmation to publish it. Do not publish a partial batch.
6. Publish each selected reaction and only the exact reply text approved for
   that target. If a draft is edited, ask for approval of the new exact text
   before publishing it.
7. Never resolve threads or post general PR comments.

Requires an authenticated `gh` CLI. Use `gh api graphql --paginate` to collect
threads and comments, and `gh api` REST calls for reactions and approved replies.

```sh
gh auth status
```

## Errors

Surface API, permission, and missing-context failures; never silently skip them.
