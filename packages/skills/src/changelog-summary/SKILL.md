---
name: changelog-summary
description: Summarize merged pull requests or commits into a human-readable release note entry. Use this skill when preparing changelog text without relying on Conventional Commits metadata.
license: MIT
---

# Summarize a changelog entry

Use this skill to turn merged PRs or commits into release notes that are
organized by user impact. Conventional Commits are not required.

## Inputs

- `entries`: list of `{ title, body, labels?, author? }` for merged PRs since the previous release.
- `version`: target version string (e.g. `1.4.0`).
- `date`: ISO date for the release.

## Instructions

1. Read all entries and group them into these sections, in this order.
   Omit any section with no meaningful items:
   - **Breaking changes** - backward-incompatible behavior
   - **New features** - user-visible additions
   - **Improvements** - enhancements, performance, UX polish
   - **Bug fixes** - corrections to incorrect behavior
   - **Documentation** - docs changes worth surfacing
   - **Internal** - refactors, build, CI, or dependency work
2. Write each bullet as a short outcome-focused phrase and include the PR
   reference when available.
3. Deduplicate related entries into a single bullet when they describe the
   same release-note outcome.
4. Skip low-signal chore noise such as lockfile churn or formatting-only
   changes unless they materially affect users or operators.
5. Prefer the user or operator impact over implementation details.

## Output

Return markdown in this format:

```md
## [<version>] - <date>

### Breaking changes

- <bullet> (#PR)

### New features

- <bullet> (#PR)
```

## Example

```md
## [1.4.0] - 2026-04-29

### New features

- Add retry handling for failed webhook deliveries (#128)

### Improvements

- Reduce dashboard load time for large projects (#131)

### Bug fixes

- Prevent duplicate notification emails after reconnects (#129)
```

## Common edge cases

- If an entry is labeled `breaking`, treat it as a breaking change even if
  the title sounds minor.
- If multiple PRs combine into one user-visible outcome, merge them into a
  single bullet.
- If a PR number or link is missing, do not invent one.
