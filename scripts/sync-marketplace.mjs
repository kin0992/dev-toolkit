#!/usr/bin/env node
// Sync marketplace.json plugin versions from each plugin's .claude-plugin/plugin.json.
// Run with --check to fail (exit 1) on drift without writing.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const MARKETPLACES = [
  resolve(repoRoot, '.claude-plugin/marketplace.json'),
  resolve(repoRoot, '.github/plugin/marketplace.json'),
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
}
