---
'@kin0992/tsconfig': minor
'@kin0992/oxc-config': minor
'@kin0992/vitest-config': minor
'@kin0992/skills': minor
---

Publish to the public npm registry (npmjs.org) with provenance.

These packages now ship from `https://registry.npmjs.org` under public access
instead of GitHub Packages. Consumers no longer need a `read:packages` token or
a scoped `.npmrc` entry — a plain `pnpm add @kin0992/<pkg>` works anonymously.
Existing GitHub Packages versions remain available but will not receive updates.
