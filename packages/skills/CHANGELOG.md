# @kin0992/skills

## 0.1.0

### Minor Changes

- 51ca22e: Add `branch-name` skill to the `git-skills` plugin.

  The new skill suggests well-formed Git branch names following the
  `<activity-type>/<activity-name>` convention with five activity types:
  `features`, `fixes`, `refactors`, `chores`, and `docs`.

- e0258b1: Organize skills by category. Skill sources now live under
  `src/<category>/<skill>/SKILL.md`, starting with the `git/` category for the
  existing `commit-message` and `pr-title-description` skills.

  **Breaking (pre-1.0):** the package subpath exports changed accordingly.

  Before:

  ```ts
  import.meta.resolve('@kin0992/skills/commit-message');
  import.meta.resolve('@kin0992/skills/pr-title-description');
  ```

  After:

  ```ts
  import.meta.resolve('@kin0992/skills/git/commit-message');
  import.meta.resolve('@kin0992/skills/git/pr-title-description');
  ```

  The marketplace `git-skills` plugin and its `SKILL.md` content are unchanged
  for end users — only the on-disk paths moved.

## 0.0.3

### Patch Changes

- 9266551: Upgrade SKILL.md frontmatter to Waza high-compliance format and trim content to stay within 500-token budget

## 0.0.2

### Patch Changes

- bf533a6: Format code using new code style rules

## 0.0.1

### Patch Changes

- b34ed8d: Refresh the skills package to follow the Agent Skills spec, including
  spec-compliant frontmatter and structured instructions for each skill.
  Keep the commit-message guidance aligned with classic Git commit rules,
  including a 50-character subject line, a 72-character wrapped body, and
  an explicit ban on Conventional Commits prefixes.
