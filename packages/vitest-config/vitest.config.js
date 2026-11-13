import { defineConfig } from 'vitest/config';

// Tests for this package only; the fixture project under test/fixture is
// run by the smoke test itself, not collected here.
export default defineConfig({
  test: {
    include: ['test/*.test.js'],
  },
});
