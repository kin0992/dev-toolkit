---
'@kin0992/tsconfig': patch
---

Move `@tsconfig/node24` from `devDependencies` to `dependencies`.

`base.json` (and therefore `node.json` and `library.json`) declares
`"extends": "@tsconfig/node24"`, but the package was only a dev dependency, so it
was never installed for consumers. Any project extending `@kin0992/tsconfig/base`
failed with `error TS6053: File '@tsconfig/node24' not found`.
