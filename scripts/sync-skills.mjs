#!/usr/bin/env node

import {
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
if (process.argv.slice(2).some((argument) => argument !== '--check')) {
  throw new Error('Usage: node scripts/sync-skills.mjs [--check]');
}

const within = (root, path) => {
  const local = relative(root, path);
  if (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local)) {
    throw new Error(`Path escapes ${relative(repoRoot, root)}: ${path}`);
  }
  return path;
};

const inspect = (path, replaceableLinks = new Set()) => {
  within(repoRoot, path);
  let current = repoRoot;
  let info = lstatSync(current);
  for (const segment of relative(repoRoot, path).split(sep).filter(Boolean)) {
    current = join(current, segment);
    info = lstatSync(current, { throwIfNoEntry: false });
    if (!info) {
      return;
    }
    if (info.isSymbolicLink()) {
      if (replaceableLinks.has(current)) {
        return;
      }
      throw new Error(`Unexpected symlink: ${relative(repoRoot, current)}`);
    }
  }
  return info;
};

const readJson = (path) => {
  inspect(path);
  return JSON.parse(readFileSync(path, 'utf8'));
};

const readTree = (root, prefix = '') => {
  if (!inspect(join(root, prefix))?.isDirectory()) {
    throw new Error(`Missing directory: ${relative(repoRoot, join(root, prefix))}`);
  }
  const files = new Map();
  for (const entry of readdirSync(join(root, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      for (const [child, content] of readTree(root, path)) {
        files.set(child, content);
      }
    } else if (entry.isFile()) {
      files.set(path, readFileSync(join(root, path)));
    } else {
      throw new Error(`Expected a regular file or directory: ${join(root, path)}`);
    }
  }
  return files;
};

const validateReferences = (root, files) => {
  for (const [name, content] of files) {
    if (!name.endsWith('.md')) {
      continue;
    }
    for (const match of content.toString().matchAll(/\[[^\]]*\]\(([^)\s]+)\)/gu)) {
      const link = match[1].split('#')[0];
      if (!link || /^(https?|mailto):/u.test(link)) {
        continue;
      }
      const path = within(root, resolve(dirname(join(root, name)), decodeURIComponent(link)));
      const local = relative(root, path).split(sep).join('/');
      if (!files.has(local) && ![...files.keys()].some((file) => file.startsWith(`${local}/`))) {
        throw new Error(`Missing resource in ${relative(repoRoot, root)}: ${link}`);
      }
    }
  }
};

const packageRoot = join(repoRoot, 'packages/skills');
const { exports: skillExports } = readJson(join(packageRoot, 'package.json'));
const policyPath = join(packageRoot, 'shared/writing-quality.md');
inspect(policyPath);
const policy = readFileSync(policyPath, 'utf8');
const expectedFiles = new Map();
const replacements = new Set();
const expectedSkills = new Map();

for (const [entrypoint, source] of Object.entries(skillExports)) {
  const match =
    typeof source === 'string'
      ? /^\.\/src\/([a-z0-9-]+)\/([a-z0-9-]+)\/SKILL\.md$/u.exec(source)
      : null;
  if (!match || entrypoint !== `./${match[1]}/${match[2]}`) {
    throw new Error(`Invalid skill export: ${source}`);
  }

  const [, category, name] = match;
  const sourceRoot = join(packageRoot, 'src', category, name);
  const files = readTree(sourceRoot);
  files.set('references/writing-quality.md', Buffer.from(policy));
  validateReferences(sourceRoot, files);
  expectedFiles.set(join(sourceRoot, 'references/writing-quality.md'), Buffer.from(policy));
  const pluginRoot = join(repoRoot, 'plugins', `${category}-skills`);
  const targetRoot = join(pluginRoot, 'skills', name);
  const skills = expectedSkills.get(pluginRoot) ?? [];
  skills.push(targetRoot);
  expectedSkills.set(pluginRoot, skills);
  inspect(dirname(targetRoot));
  const linked = lstatSync(targetRoot, { throwIfNoEntry: false })?.isSymbolicLink();
  if (linked) {
    replacements.add(targetRoot);
  } else if (inspect(targetRoot)?.isDirectory()) {
    for (const path of readTree(targetRoot).keys()) {
      if (!files.has(path)) {
        throw new Error(
          `Unexpected generated file: ${relative(repoRoot, join(targetRoot, path))}. Review and remove it explicitly.`,
        );
      }
    }
  }
  for (const [path, content] of files) {
    expectedFiles.set(join(targetRoot, path), content);
  }
}

const agentPath = join(repoRoot, 'plugins/project-manager/agents/triage.agent.md');
inspect(agentPath);
const agent = readFileSync(agentPath, 'utf8');
const start = '<!-- writing-quality:start -->';
const end = '<!-- writing-quality:end -->';
if (
  agent.split(start).length !== 2 ||
  agent.split(end).length !== 2 ||
  agent.indexOf(end) < agent.indexOf(start)
) {
  throw new Error(`Expected one writing-quality marker pair in ${agentPath}`);
}
expectedFiles.set(
  agentPath,
  Buffer.from(
    `${agent.slice(0, agent.indexOf(start))}${start}\n\n${policy.trimEnd()}\n\n${end}${agent.slice(agent.indexOf(end) + end.length)}`,
  ),
);

const marketplace = readJson(join(repoRoot, '.github/plugin/marketplace.json'));
const registeredRoots = new Set();
for (const plugin of marketplace.plugins) {
  const root = within(join(repoRoot, 'plugins'), resolve(repoRoot, plugin.source));
  registeredRoots.add(root);
  for (const directory of ['.github', '.claude-plugin']) {
    const manifest = readJson(join(root, directory, 'plugin.json'));
    if (manifest.name !== plugin.name) {
      throw new Error(`Plugin name mismatch: ${relative(repoRoot, root)}/${directory}/plugin.json`);
    }
    const declaredSkills = new Set();
    for (const component of ['skills', 'agents']) {
      if (manifest[component] === undefined) {
        continue;
      }
      if (!Array.isArray(manifest[component])) {
        throw new Error(`Expected ${component} paths in ${relative(repoRoot, root)}/${directory}`);
      }
      for (const value of manifest[component]) {
        if (typeof value !== 'string' || !value.startsWith('./')) {
          throw new Error(`Expected a plugin-relative component path: ${value}`);
        }
        const path = within(root, resolve(root, value));
        const file = component === 'skills' ? join(path, 'SKILL.md') : path;
        if (!expectedFiles.has(file) && !inspect(file, replacements)?.isFile()) {
          throw new Error(`Missing component: ${relative(repoRoot, file)}`);
        }
        if (component === 'skills') {
          declaredSkills.add(path);
        }
      }
    }
    for (const path of expectedSkills.get(root) ?? []) {
      if (!declaredSkills.has(path)) {
        throw new Error(`Missing skill component in ${directory}: ${relative(root, path)}`);
      }
    }
  }
}
for (const root of expectedSkills.keys()) {
  if (!registeredRoots.has(root)) {
    throw new Error(`Plugin is not registered: ${relative(repoRoot, root)}`);
  }
}

const changedFiles = [];
for (const [path, content] of expectedFiles) {
  const current = inspect(path, replacements);
  if (!current?.isFile() || !readFileSync(path).equals(content)) {
    changedFiles.push([path, content]);
  }
}
const drifted = replacements.size > 0 || changedFiles.length > 0;
for (const path of [...replacements, ...changedFiles.map(([file]) => file)]) {
  console.log(`${relative(repoRoot, path)}: out of sync`);
}
if (!checkOnly) {
  for (const path of replacements) {
    unlinkSync(path);
  }
  for (const [path, content] of changedFiles) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}

if (checkOnly && drifted) {
  console.error('Skill payloads are out of sync. Run `pnpm skills:sync`.');
  process.exitCode = 1;
} else {
  console.log(drifted ? 'Skill payloads synced.' : 'Skill payloads in sync.');
}
