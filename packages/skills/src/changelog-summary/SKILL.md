# Skill: changelog-summary

Summarise a set of merged PRs (or commits) into a human-readable changelog entry, without requiring Conventional Commits.

## Inputs

- `entries`: list of `{ title, body, labels?, author? }` for merged PRs since the previous release.
- `version`: target version string (e.g. `1.4.0`).
- `date`: ISO date for the release.

## Instructions

1. Group entries into these sections, in order. Omit empty sections.
   - **Breaking changes** — anything labelled `breaking`, or whose body indicates a backward-incompatible change.
   - **New features** — user-visible additions.
   - **Improvements** — enhancements, performance, UX polish.
   - **Bug fixes** — fixes for incorrect behaviour.
   - **Documentation** — docs-only changes worth surfacing.
   - **Internal** — refactors, build, CI, deps. Keep terse; omit if noisy.
2. Each line: short imperative phrase, link to the PR. Prefer the _outcome_ over the implementation.
3. Deduplicate related PRs into a single bullet when appropriate.
4. Skip pure chore noise (lockfile bumps, formatting passes) unless they materially affect users.

## Output Format

```md
## [<version>] - <date>

### Breaking changes

- <bullet> (#PR)

### New features

- <bullet> (#PR)

...
```
