export default {
  categories: {
    correctness: 'error',
    suspicious: 'error',
  },
  plugins: ['typescript', 'oxc', 'unicorn', 'import', 'promise', 'node'],
  env: {
    node: true,
    es2024: true,
  },
  ignorePatterns: ['dist/**', 'build/**', 'coverage/**', '.turbo/**', 'node_modules/**'],
  rules: {
    // eslint — correctness / code quality
    'eslint/eqeqeq': 'error',
    'eslint/no-var': 'error',
    'eslint/prefer-const': 'error',
    'eslint/no-eval': 'error',
    'eslint/no-return-assign': 'error',
    'eslint/no-self-compare': 'error',
    'eslint/no-useless-constructor': 'error',
    'eslint/no-else-return': 'error',
    'eslint/no-lonely-if': 'error',
    'eslint/guard-for-in': 'error',
    'eslint/no-throw-literal': 'error',
    'eslint/no-shadow': 'warn',

    // eslint — modern syntax
    'eslint/object-shorthand': 'error',
    'eslint/prefer-template': 'error',
    'eslint/prefer-rest-params': 'error',
    'eslint/prefer-spread': 'error',
    'eslint/prefer-exponentiation-operator': 'error',
    'eslint/prefer-object-spread': 'error',
    'eslint/logical-assignment-operators': 'error',
    'eslint/operator-assignment': 'error',

    // typescript — imports / exports
    'typescript/consistent-type-imports': 'error',
    'typescript/consistent-type-exports': 'error',
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-useless-empty-export': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-var-requires': 'error',
    'typescript/triple-slash-reference': 'error',

    // typescript — type safety (no type-info needed)
    'typescript/no-explicit-any': 'error',
    'typescript/no-non-null-assertion': 'warn',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-optional-chain': 'error',
    'typescript/prefer-nullish-coalescing': 'error',
    'typescript/no-inferrable-types': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/prefer-for-of': 'error',
    'typescript/prefer-function-type': 'error',
    'typescript/array-type': 'error',
    'typescript/ban-ts-comment': 'warn',
    'typescript/no-namespace': 'warn',
    'typescript/no-deprecated': 'warn',
    'typescript/consistent-generic-constructors': 'error',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-confusing-non-null-assertion': 'error',
    'typescript/no-extraneous-class': 'error',
    'typescript/only-throw-error': 'error',
    'typescript/ban-types': 'error',

    // typescript — type-aware (requires --tsconfig flag)
    'typescript/no-floating-promises': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/await-thenable': 'error',
    'typescript/require-await': 'error',
    'typescript/return-await': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/no-redundant-type-constituents': 'error',
    'typescript/restrict-template-expressions': 'error',
    'typescript/switch-exhaustiveness-check': 'error',

    // import
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/no-self-import': 'error',
    'import/first': 'error',

    // promise
    'promise/no-return-wrap': 'error',
    'promise/prefer-await-to-then': 'error',
    'promise/no-nesting': 'error',

    // node
    'no-console': 'off',
    'node/no-process-env': 'off',

    // unicorn — array / iteration
    'unicorn/no-array-for-each': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-array-flat-map': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/no-useless-length-check': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/no-single-promise-in-promise-methods': 'error',

    // unicorn — string / number
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-date-now': 'error',
    'unicorn/prefer-math-min-max': 'error',

    // unicorn — error / control flow
    'unicorn/throw-new-error': 'error',
    'unicorn/error-message': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-negated-condition': 'error',
    'unicorn/prefer-logical-operator-over-ternary': 'error',
    'unicorn/no-static-only-class': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/no-unnecessary-await': 'error',
    'unicorn/no-useless-promise-resolve-reject': 'error',

    // unicorn — misc
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/no-typeof-undefined': 'error',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/no-useless-switch-case': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/test/**'],
      rules: {
        'typescript/no-explicit-any': 'off',
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
      },
    },
  ],
};
