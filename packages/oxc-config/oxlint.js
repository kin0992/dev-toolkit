// Backward-compatible default export — resolves to the core flavor.
// Existing consumers using `@kin0992/oxc-config/oxlint` are unaffected.
//
// For new projects, prefer the explicit flavor imports:
//   @kin0992/oxc-config/oxlint/core     — any TypeScript project
//   @kin0992/oxc-config/oxlint/react    — React + JSX A11y + perf
//   @kin0992/oxc-config/oxlint/node     — Node.js backends
//   @kin0992/oxc-config/oxlint/testing  — test-file overrides (use in `overrides`)
export { default } from './oxlint/core.js';
