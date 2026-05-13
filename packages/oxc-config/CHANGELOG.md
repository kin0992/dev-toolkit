# @kin0992/oxc-config

## 0.2.1

### Patch Changes

- 19a7c57: Remove peerDependencies

## 0.2.0

### Minor Changes

- 2970dfb: Add multi-flavor oxlint configs

  Introduce four composable lint flavors so consumers can pick exactly the rules they need:

  - `@kin0992/oxc-config/oxlint/core` — curated rules for any TypeScript project (eslint, typescript, import, unicorn, promise plugins)
  - `@kin0992/oxc-config/oxlint/react` — extends core with React, JSX A11y, and React Perf rules
  - `@kin0992/oxc-config/oxlint/node` — extends core with Node.js-specific rules
  - `@kin0992/oxc-config/oxlint/testing` — Jest/Vitest overrides for test files (use inside `overrides`)

  The existing `@kin0992/oxc-config/oxlint` export is preserved as a backward-compatible re-export of `core`.

## 0.1.0

### Minor Changes

- bf533a6: Create new oxlint and oxformat configuration to share across projects
- bf533a6: Add a shared OXC config package, wire the monorepo to shared `oxfmt` and `oxlint` configs, and document the new consumer setup while keeping the legacy `@kin0992/prettier-config` package available.
