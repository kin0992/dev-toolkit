import core from './core.js';

export default {
  ...core,
  plugins: [...(core.plugins ?? []), 'react', 'react-perf', 'jsx-a11y'],
  env: {
    ...core.env,
    browser: true,
  },
  rules: {
    ...core.rules,

    // react — correctness
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-script-url': 'error',
    'react/no-children-prop': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-string-refs': 'error',
    'react/no-unknown-property': 'error',
    'react/no-danger-with-children': 'error',
    'react/rules-of-hooks': 'error',
    'react/forward-ref-uses-ref': 'error',
    'react/checked-requires-onchange-or-readonly': 'error',
    'react/button-has-type': 'error',

    // react — hooks
    'react/exhaustive-deps': 'warn',
    'react/hook-use-state': 'error',

    // react — best practices
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-fragments': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'warn',
    'react/no-unsafe': 'warn',
    'react/only-export-components': 'warn',

    // react-perf — avoid unnecessary re-renders
    'react-perf/jsx-no-new-array-as-prop': 'warn',
    'react-perf/jsx-no-new-object-as-prop': 'warn',
    'react-perf/jsx-no-new-function-as-prop': 'warn',
    'react-perf/jsx-no-jsx-as-prop': 'warn',

    // jsx-a11y — accessibility
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/anchor-ambiguous-text': 'warn',
  },
};
