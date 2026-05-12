# @kin0992/oxc-config

Shared OXC formatter and lint configuration.

## Install

```sh
pnpm add -D @kin0992/oxc-config oxfmt oxlint
```

---

## Formatter

```ts
// oxfmt.config.ts
import config from '@kin0992/oxc-config/oxfmt';

export default config;
```

---

## Linter flavors

The lint config ships four composable flavors. Pick the one that matches your project type.

| Import path                          | Use case                                              |
| ------------------------------------ | ----------------------------------------------------- |
| `@kin0992/oxc-config/oxlint`         | Backward-compat alias for `core` (existing consumers) |
| `@kin0992/oxc-config/oxlint/core`    | Any TypeScript / JS project                           |
| `@kin0992/oxc-config/oxlint/react`   | React + JSX A11y + React Perf (includes `core`)       |
| `@kin0992/oxc-config/oxlint/node`    | Node.js backends (includes `core`)                    |
| `@kin0992/oxc-config/oxlint/testing` | Test-file overrides — use inside `overrides`          |

### Plain TypeScript project

```ts
// oxlint.config.ts
import config from '@kin0992/oxc-config/oxlint/core';

export default config;
```

### React project

```ts
// oxlint.config.ts
import config from '@kin0992/oxc-config/oxlint/react';

export default config;
```

### Node.js backend

```ts
// oxlint.config.ts
import config from '@kin0992/oxc-config/oxlint/node';

export default config;
```

### Node.js backend with separate test rules

```ts
// oxlint.config.ts
import config from '@kin0992/oxc-config/oxlint/node';
import testing from '@kin0992/oxc-config/oxlint/testing';

export default {
  ...config,
  overrides: [
    ...(config.overrides ?? []),
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/test/**'],
      ...testing,
    },
  ],
};
```

### React project with separate test rules

```ts
// oxlint.config.ts
import config from '@kin0992/oxc-config/oxlint/react';
import testing from '@kin0992/oxc-config/oxlint/testing';

export default {
  ...config,
  overrides: [
    ...(config.overrides ?? []),
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/test/**'],
      ...testing,
    },
  ],
};
```

---

## Type-aware rules

Several TypeScript rules in `core` (and all flavors that extend it) require type information:

- `typescript/no-floating-promises`
- `typescript/no-misused-promises`
- `typescript/await-thenable`
- `typescript/require-await`
- `typescript/return-await`
- `typescript/no-unsafe-argument`
- `typescript/no-unsafe-assignment`
- `typescript/no-unsafe-call`
- `typescript/no-unsafe-member-access`
- `typescript/no-unsafe-return`
- `typescript/no-unnecessary-type-assertion`
- `typescript/no-redundant-type-constituents`
- `typescript/restrict-template-expressions`
- `typescript/switch-exhaustiveness-check`

To enable them, pass `--tsconfig` when running oxlint:

```json
{
  "scripts": {
    "lint": "oxlint --tsconfig tsconfig.json --fix",
    "lint:check": "oxlint --tsconfig tsconfig.json"
  }
}
```

If you prefer to skip type-aware rules (faster, no tsconfig required), override them individually in your local `oxlint.config.ts`:

```ts
import config from '@kin0992/oxc-config/oxlint/core';

export default {
  ...config,
  rules: {
    ...config.rules,
    'typescript/no-floating-promises': 'off',
    // ... other type-aware rules you want to disable
  },
};
```
