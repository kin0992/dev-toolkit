import config from '@kin0992/oxc-config/oxlint';

export default {
  ...config,
  options: {
    reportUnusedDisableDirectives: 'error',
  },
  rules: {
    ...config.rules,
    'no-new': 'off',
  },
  overrides: [...(config.overrides || [])],
};
