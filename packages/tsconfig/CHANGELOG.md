# @kin0992/tsconfig

## 0.1.2

### Patch Changes

- a70b3b2: Move `@tsconfig/node24` from `devDependencies` to `dependencies`.

  `base.json` (and therefore `node.json` and `library.json`) declares
  `"extends": "@tsconfig/node24"`, but the package was only a dev dependency, so it
  was never installed for consumers. Any project extending `@kin0992/tsconfig/base`
  failed with `error TS6053: File '@tsconfig/node24' not found`.

## 0.1.1

### Patch Changes

- 8bf1542: Republish to npmjs.org with build provenance via npm Trusted Publishing (OIDC).
  No functional changes — this release attaches signed provenance attestations
  that earlier versions were published without.

## 0.1.0

### Minor Changes

- 51632aa: Publish to the public npm registry (npmjs.org) with provenance.

  These packages now ship from `https://registry.npmjs.org` under public access
  instead of GitHub Packages. Consumers no longer need a `read:packages` token or
  a scoped `.npmrc` entry — a plain `pnpm add @kin0992/<pkg>` works anonymously.
  Existing GitHub Packages versions remain available but will not receive updates.

## 0.0.2

### Patch Changes

- 286e8d0: Use @tsconfig/node24 for tsconfig configurations

## 0.0.1

### Patch Changes

- bf533a6: Format code using new code style rules
