# Skill: code-review

Review a pull request diff with a _very high_ signal-to-noise ratio. Surface only issues that genuinely matter.

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

1. Read the diff with the surrounding code context. If context is insufficient, request the missing files instead of guessing.
2. For each finding, output: file path, line(s), severity (`blocker` | `major` | `minor`), and a one-paragraph explanation including a suggested fix or test.
3. End with a brief summary: total findings by severity and a `LGTM` / `REQUEST_CHANGES` / `COMMENT` verdict.
4. If you find nothing, say so plainly. Do not invent findings.

## Output Format

```
## Findings

### <file>:<line> — <severity>
<explanation and suggestion>

## Summary
- blocker: N, major: N, minor: N
- Verdict: <LGTM | REQUEST_CHANGES | COMMENT>
```
