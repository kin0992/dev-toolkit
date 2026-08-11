---
'@kin0992/oxc-config': minor
---

Add more `core` oxlint rules covering security, type-strictness, and consistency:

- `eslint/no-implied-eval`, `eslint/no-new-func` — block string-based `eval`-like execution
- `eslint/no-param-reassign` — disallow reassigning function parameters
- `typescript/no-shadow` — type-aware variable shadowing (stricter than `eslint/no-shadow`)
- `typescript/explicit-function-return-type` — require explicit return types (disabled for test files)
- `typescript/strict-boolean-expressions`, `typescript/no-unnecessary-condition` — catch implicit truthy/falsy checks and conditions the type system already proves impossible
- `import/no-mutable-exports` — disallow `export let`
- `unicorn/filename-case`, `unicorn/prefer-ternary` — consistency rules
