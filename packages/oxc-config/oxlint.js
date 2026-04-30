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
    'eslint/prefer-const': 'error',
    'import/no-cycle': 'error',
    'no-console': 'off',
    'node/no-process-env': 'off',
    'promise/no-return-wrap': 'error',
    'typescript/no-explicit-any': 'error',
    'unicorn/prefer-node-protocol': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.*', '**/*.spec.*', '**/test/**'],
      rules: {
        'typescript/no-explicit-any': 'off',
      },
    },
  ],
};
