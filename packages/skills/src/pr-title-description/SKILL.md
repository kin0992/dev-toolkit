# Skill: pr-title-description

Generate a PR title and description from a branch's commit log and diff against the base branch.

## Inputs

- `commits`: list of commit messages on the branch (from `git log base..head`).
- `diff`: full or summarized diff against the base branch.
- `template` (optional): the repo's PR template content.

## Instructions

1. **Title**: Imperative mood, ≤ 72 characters, summarises the _user-facing_ change. If multiple themes exist, pick the dominant one and call out the rest in the body.
2. **Description**: Use this structure (omit empty sections):
   - **Why** — motivation, linked issue/context.
   - **What** — concise bullet list of the changes (group by area, not by file).
   - **How to verify** — manual steps or which tests to look at.
   - **Risks / follow-ups** — anything reviewers should watch for.
3. If a template is provided, fill its sections instead of inventing a new structure.
4. Do not duplicate the diff; describe the _intent_ and _outcome_.
5. Never fabricate ticket numbers, links, or screenshots.

## Output Format

```
TITLE: <pr title>

<description in markdown>
```
