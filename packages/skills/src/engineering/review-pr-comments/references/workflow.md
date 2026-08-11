# Workflow

## Collect the review

1. Identify one PR from a URL, `OWNER/REPO#NUMBER`, or a number in the current
   repository. Ask if it is missing or ambiguous.
2. Verify `gh auth status`.
3. Use the collection queries in [`gh-commands.md`](gh-commands.md). Paginate
   both review threads and comments within each thread.
4. Inspect `gh pr diff` and relevant source context. Human, bot, Copilot, and
   other agent comments all count.
5. Process every actionable opening comment and reply in every unresolved
   thread. Skip acknowledgements, status messages, duplicates, and replies with
   no request or technical claim; report the reason.

## Decide and stage the batch

For each actionable comment, show and retain:

- author, file/line, and comment URL
- requested change
- whether it is correct, relevant, and still applicable
- recommendation with brief evidence
- one concise suggested reply, or an explicit reason no reply is needed

Ask one question at a time:

- `Accept (👍)` — valid and should be addressed
- `Defer (👀)` — valid, but should be handled later
- `Reject (👎)` — invalid, irrelevant, duplicate, or already addressed

Do not call any reaction or reply mutation while questions remain. Store the
decision, target comment, and suggested reply for each item. For a single
actionable comment, the same staging rules apply; skip the batch summary only
when there is no second item to group.

After all decisions are collected, show a grouped summary containing every
comment, selected reaction, and exact reply draft. Identify accepted comments
that require code changes and ask explicitly:

- `Implement the accepted changes`
- `Leave code unchanged`

An `Accept` decision does not authorize editing code. If implementation is
approved, make and validate the changes before finalizing any affected reply
drafts. If implementation is declined, leave the code unchanged and continue
with the selected decisions. Do not react to non-actionable comments. A
reaction does not mean code changed.

After any authorized implementation is complete, show the refreshed grouped
plan and ask for one confirmation to publish it. If the user declines, publish
nothing. If implementation is explicitly requested but the user declines this
consent step, treat it as declined rather than inferring approval.

## Draft and approve a reply

Draft a concise reply consistent with the decision. Do not claim a change was
implemented or verified unless that work completed.

During triage, show the exact draft and target URL alongside the decision
question. The decision does not authorize changing the draft or targeting a
different comment. Before the grouped publish confirmation, ask:

- `Publish the grouped plan`
- `Edit a draft`
- `Cancel publication`

If edited, show the new exact text and ask for approval of that draft before
the grouped publish confirmation. Reaction approval never authorizes a reply
unless the exact draft is included in the confirmed plan. A `Defer` or
`Reject` decision may intentionally have no reply.

After grouped approval, use the reaction and review-comment reply commands in
[`gh-commands.md`](gh-commands.md).

Never use a general PR comment endpoint and never resolve or unresolve threads.
Finish with decisions, posted and declined replies, skipped comments, and
errors.
