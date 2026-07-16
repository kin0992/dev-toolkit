---
name: review-pr-comments
description: |
  **INTERACTIVE SKILL** - Evaluate every actionable comment in unresolved
  GitHub PR review threads, including agent comments.
  USE FOR: review unresolved PR comments, triage review threads, process
  Copilot feedback.
  DO NOT USE FOR: general PR comments, resolving threads, unapproved replies.
  INVOKES: gh CLI and the bundled Python helper.
license: MIT
---

# Review unresolved PR comments

## Instructions

1. Read and follow the complete [workflow](references/workflow.md).
2. Process one PR and all actionable comments in its unresolved review threads;
   include bots, but exclude general PR conversation comments.
3. Evaluate each comment against the diff and source context.
4. Ask one question at a time. Record `Accept` with `+1`, `Defer` with `eyes`,
   and `Ignore` with `-1`. Do not edit code merely because it was accepted.
5. Suggest possible answers. Post a reply only after exact-text and target
   approval; editing a draft is not approval.
6. Never resolve threads or post general PR comments.

Requires Python 3.10+ and authenticated `gh`. Use:

```sh
python3 <skill-directory>/scripts/pr_review_comments.py <list|react|reply>
```

## Errors

Surface API, permission, and missing-context failures; never silently skip them.
