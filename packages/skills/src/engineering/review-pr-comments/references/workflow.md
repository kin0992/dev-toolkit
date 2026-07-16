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

## Decide and react

For each actionable comment, show:

- author, file/line, and comment URL
- requested change
- whether it is correct, relevant, and still applicable
- recommendation with brief evidence
- concise possible replies when different decisions need different responses

Ask one question at a time:

- `Accept (👍)` — valid and should be addressed
- `Defer (👀)` — valid, but should be handled later
- `Ignore (👎)` — invalid, irrelevant, duplicate, or already addressed

After the decision, use the reaction commands in
[`gh-commands.md`](gh-commands.md). Replace only the authenticated user's
previous `+1`, `-1`, or `eyes` decision reactions.

Do not react to non-actionable comments. A reaction does not mean code changed.
If implementation is explicitly requested, treat it as separate work that may
run asynchronously.

## Draft and approve a reply

Draft a concise reply consistent with the decision. Do not claim a change was
implemented or verified unless that work completed.

Show the exact text and target URL, then ask:

- `Post exactly as shown`
- `Edit before posting`
- `Do not reply`

Only the first choice authorizes posting that exact draft. If edited, show the
new exact text and ask again. Reaction approval never authorizes a reply.

After exact-text approval, use the review-comment reply command in
[`gh-commands.md`](gh-commands.md).

Never use a general PR comment endpoint and never resolve or unresolve threads.
Finish with decisions, posted and declined replies, skipped comments, and
errors.
