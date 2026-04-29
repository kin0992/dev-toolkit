---
name: code-review
description: Review a pull request diff with a high signal-to-noise ratio. Use this skill when a PR needs focused findings about bugs, security, correctness, performance, or material test gaps.
license: MIT
---

# Review a pull request diff

Use this skill to produce focused review findings that matter. Ignore
style noise and avoid speculative comments.

## Scope

Comment on:

- **Bugs and logic errors** — incorrect conditions, off-by-one, race conditions, missing error handling.
- **Security** — injection, auth bypass, secret leakage, unsafe deserialization, SSRF, etc.
- **Correctness regressions** — broken contracts, removed validation, changed semantics of public APIs.
- **Performance cliffs** — N+1 queries, accidental quadratic loops, unbounded memory growth.
- **Test gaps** that materially reduce confidence.

Do **not** comment on:

- Style, formatting, naming bikesheds, or anything a linter/formatter would catch.
- Personal preference refactors with no behavioural impact.
- Hypothetical issues unsupported by the diff.

## Instructions

1. Read the diff with enough surrounding context to understand the change.
   If context is missing, ask for the relevant files instead of guessing.
2. Only report findings that are supported by the code and likely to
   matter in practice.
3. For each finding, include:
   - file path and line or line range
   - severity: `blocker`, `major`, or `minor`
   - a short explanation of the issue
   - a suggested fix, mitigation, or test when helpful
4. End with a brief summary that includes the total findings by severity
   and a verdict of `LGTM`, `REQUEST_CHANGES`, or `COMMENT`.
5. If there are no meaningful findings, say so plainly and do not invent
   issues.

## Output

Return the review in this format:

```text
## Findings

### <file>:<line> — <severity>
<explanation and suggestion>

## Summary
- blocker: N, major: N, minor: N
- Verdict: <LGTM | REQUEST_CHANGES | COMMENT>
```

## Example

```text
## Findings

### src/auth/session.ts:84-96 — major
The new cache lookup returns a session object without checking its
expiration timestamp. Expired sessions can therefore be treated as
valid until the cache entry is evicted. Re-apply the expiry validation
after the cache hit or add a regression test that covers stale entries.

## Summary
- blocker: 0, major: 1, minor: 0
- Verdict: REQUEST_CHANGES
```

## Common edge cases

- If the diff lacks enough context to judge correctness, request more
  code instead of speculating.
- If a finding is purely stylistic or preference-driven, omit it.
- If a risky change has no obvious regression test coverage, it can be a
  valid finding when the gap materially lowers confidence.
