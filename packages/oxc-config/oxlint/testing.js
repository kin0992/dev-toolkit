/**
 * Testing overrides for Jest / Vitest.
 *
 * Intended to be merged into a `overrides` block scoped to test files:
 *
 * @example
 * ```ts
 * import config from '@kin0992/oxc-config/oxlint/node';
 * import testing from '@kin0992/oxc-config/oxlint/testing';
 *
 * export default {
 *   ...config,
 *   overrides: [
 *     ...(config.overrides ?? []),
 *     { files: ['**\/*.test.*', '**\/*.spec.*'], ...testing },
 *   ],
 * };
 * ```
 */
export default {
  plugins: ['jest'],
  rules: {
    // relax strict type-safety rules — mocks frequently produce `any`
    'typescript/no-explicit-any': 'off',
    'typescript/no-unsafe-argument': 'off',
    'typescript/no-unsafe-assignment': 'off',
    'typescript/no-unsafe-call': 'off',
    'typescript/no-unsafe-member-access': 'off',
    'typescript/no-unsafe-return': 'off',

    // jest — test correctness
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
    'jest/expect-expect': 'error',
    'jest/no-export': 'error',
    'jest/no-conditional-expect': 'error',
    'jest/no-standalone-expect': 'error',
    'jest/valid-describe-callback': 'error',
    'jest/valid-title': 'error',
    'jest/require-top-level-describe': 'error',

    // jest — quality warnings
    'jest/no-disabled-tests': 'warn',
    'jest/prefer-strict-equal': 'warn',
    'jest/prefer-to-be': 'warn',
    'jest/prefer-to-have-length': 'warn',
  },
};
