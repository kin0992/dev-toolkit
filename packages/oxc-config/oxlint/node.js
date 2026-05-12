import core from './core.js';

export default {
  ...core,
  plugins: [...(core.plugins ?? [])],
  env: {
    node: true,
    es2024: true,
  },
  rules: {
    ...core.rules,

    // enforce ESM in Node.js projects
    'unicorn/prefer-module': 'error',

    // prefer throwing instead of process.exit
    'unicorn/no-process-exit': 'error',

    // encourage centralising env access — enable at 'warn' for visibility
    'node/no-process-env': 'warn',
  },
};
