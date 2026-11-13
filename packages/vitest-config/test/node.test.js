import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import config from '../node.js';

const packageDir = fileURLToPath(new URL('..', import.meta.url));
const fixtureDir = join(packageDir, 'test', 'fixture');
const vitestBin = join(packageDir, 'node_modules', '.bin', 'vitest');
const packageJson = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
const reportsDir = mkdtempSync(join(tmpdir(), 'vitest-config-'));

// Drop the outer run's VITEST* variables so the nested run behaves like a
// consumer invoking vitest from a shell.
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST')),
);

describe('@kin0992/vitest-config/node', () => {
  afterAll(() => {
    rmSync(reportsDir, { recursive: true, force: true });
  });

  it('runs a consumer project with v8 coverage', () => {
    const result = spawnSync(
      vitestBin,
      [
        'run',
        '--root',
        fixtureDir,
        '--coverage',
        '--coverage.reporter=json-summary',
        `--coverage.reportsDirectory=${reportsDir}`,
      ],
      { encoding: 'utf8', env: { ...env, NO_COLOR: '1', FORCE_COLOR: '0' } },
    );
    const output = `${result.stdout}${result.stderr}`;

    expect(result.status, output).toBe(0);
    expect(output).toContain('Tests  1 passed');

    // Coverage includes src/**/*.ts and excludes the test file itself.
    const summary = JSON.parse(readFileSync(join(reportsDir, 'coverage-summary.json'), 'utf8'));
    const covered = Object.keys(summary)
      .filter((key) => key !== 'total')
      .map((file) => relative(fixtureDir, file));

    expect(covered).toStrictEqual(['src/sum.ts']);
  }, 30_000);

  // Inside this workspace pnpm links the provider next to vitest, so the run
  // above passes even if the package forgets to declare it. Check the
  // manifest directly: a consumer only gets the provider through this peer.
  it('declares the coverage provider it configures as a peer', () => {
    const provider = `@vitest/coverage-${config.test.coverage.provider}`;

    expect(packageJson.peerDependencies).toHaveProperty(provider);
    expect(packageJson.peerDependencies[provider]).toBe(packageJson.peerDependencies.vitest);
  });
});
