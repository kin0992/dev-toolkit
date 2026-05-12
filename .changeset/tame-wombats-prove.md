---
'@kin0992/oxc-config': minor
---

Add multi-flavor oxlint configs

Introduce four composable lint flavors so consumers can pick exactly the rules they need:

- `@kin0992/oxc-config/oxlint/core` — curated rules for any TypeScript project (eslint, typescript, import, unicorn, promise plugins)
- `@kin0992/oxc-config/oxlint/react` — extends core with React, JSX A11y, and React Perf rules
- `@kin0992/oxc-config/oxlint/node` — extends core with Node.js-specific rules
- `@kin0992/oxc-config/oxlint/testing` — Jest/Vitest overrides for test files (use inside `overrides`)

The existing `@kin0992/oxc-config/oxlint` export is preserved as a backward-compatible re-export of `core`.
