---
'@kin0992/skills': minor
---

Organize skills by category. Skill sources now live under
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
