#!/usr/bin/env node
// Sync marketplace.json plugin versions from each plugin's .claude-plugin/plugin.json.
// Run with --check to fail (exit 1) on drift without writing.

import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// `.claude-plugin/marketplace.json` is currently a symlink to the one under
// `.github/plugin/`, but list both so this keeps working if they ever become
// independent files. Dedupe by real path so a shared target is processed once
// (otherwise --check reports the same drift twice under two paths).
const MARKETPLACES = [
  ...new Set(
    ['.claude-plugin/marketplace.json', '.github/plugin/marketplace.json'].map((p) => {
      const abs = resolve(repoRoot, p);
      try {
        return realpathSync(abs);
      } catch {
        return abs;
      }
    }),
  ),
];

const checkOnly = process.argv.includes('--check');

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const pluginVersion = (source) => {
  const path = resolve(repoRoot, source, '.claude-plugin/plugin.json');
  return readJson(path).version;
};

let drifted = false;

for (const marketplacePath of MARKETPLACES) {
  const marketplace = readJson(marketplacePath);
  let touched = false;

  for (const plugin of marketplace.plugins ?? []) {
    const expected = pluginVersion(plugin.source);
    if (plugin.version !== expected) {
      drifted = true;
      touched = true;
      console.log(`${marketplacePath}: ${plugin.name} ${plugin.version} -> ${expected}`);
      plugin.version = expected;
    }
  }

  if (touched && !checkOnly) {
    writeFileSync(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
  }
}

if (drifted && checkOnly) {
  console.error('\nMarketplace plugin versions are out of sync with plugin.json sources.');
  console.error('Run `pnpm marketplace:sync` to fix.');
  process.exit(1);
}

if (!drifted) {
  console.log('Marketplace versions in sync.');
} else {
  console.log('\nMarketplace versions synced.');
}
