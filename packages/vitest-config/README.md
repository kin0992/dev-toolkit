# @kin0992/vitest-config

## Install

```sh
pnpm add -D @kin0992/vitest-config vitest
```

Vitest 4 and 5 are supported. The config reports coverage with the v8
provider, so add `@vitest/coverage-v8` (same version as `vitest`) if you run
with `--coverage`.

## Use

```ts
// vitest.config.ts
export { default } from '@kin0992/vitest-config/node';
```
