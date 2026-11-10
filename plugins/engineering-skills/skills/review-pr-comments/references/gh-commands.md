# `gh` commands

Use only `gh` and shell built-ins. Keep `REPO` as `OWNER/REPO`, and split it
into `OWNER` and `NAME`. Resolve `NUMBER` with `gh pr view`.

```sh
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
NUMBER=$(gh pr view "$PR" --repo "$REPO" --json number --jq '.number')
OWNER=${REPO%%/*}
NAME=${REPO#*/}
```

For a PR URL, omit `--repo`; derive `REPO` from its URL:

```sh
REPO=$(gh pr view "$PR" --json url \
  --jq '.url | split("/")[3:5] | join("/")')
```

## Collect unresolved threads

```sh
gh api graphql --paginate \
  -F owner="$OWNER" -F name="$NAME" -F number="$NUMBER" \
  -f query='
query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviewThreads(first: 100, after: $endCursor) {
        nodes {
          id isResolved isOutdated path line originalLine
          comments(first: 100) {
            nodes {
              id databaseId url body createdAt updatedAt
              path line originalLine diffHunk
              author { login }
              replyTo { id databaseId }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}' \
  --jq '.data.repository.pullRequest.reviewThreads.nodes[]
    | select(.isResolved == false)'
```

`--paginate` covers the outer thread connection. For any returned thread whose
`comments.pageInfo.hasNextPage` is true, paginate that thread separately:

```sh
gh api graphql --paginate \
  -F threadId="$THREAD_ID" \
  -f query='
query($threadId: ID!, $endCursor: String) {
  node(id: $threadId) {
    ... on PullRequestReviewThread {
      comments(first: 100, after: $endCursor) {
        nodes {
          id databaseId url body createdAt updatedAt
          path line originalLine diffHunk
          author { login }
          replyTo { id databaseId }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}' \
  --jq '.data.node.comments.nodes[]'
```

## Replace a decision reaction

Run these mutations only after the complete grouped plan is approved. Do not
run them while collecting decisions or if the grouped plan is cancelled.

Set `REACTION` to `+1`, `-1`, or `eyes`. Remove only decision reactions made by
the authenticated user, then add the selected reaction:

```sh
LOGIN=$(gh api user --jq '.login')

for REACTION_ID in $(gh api --paginate \
  "repos/$REPO/pulls/comments/$COMMENT_ID/reactions?per_page=100" \
  --jq ".[] | select(.user.login == \"$LOGIN\")
    | select(.content == \"+1\" or .content == \"-1\" or .content == \"eyes\")
    | .id"); do
  gh api --method DELETE \
    "repos/$REPO/pulls/comments/$COMMENT_ID/reactions/$REACTION_ID"
done

gh api --method POST \
  "repos/$REPO/pulls/comments/$COMMENT_ID/reactions" \
  -f content="$REACTION"
```

## Post an approved reply

Run only after the user approves the exact `APPROVED_REPLY` text and target:

```sh
gh api --method POST \
  "repos/$REPO/pulls/$NUMBER/comments/$COMMENT_ID/replies" \
  -f body="$APPROVED_REPLY"
```

Do not call general PR comment or thread-resolution mutations.
