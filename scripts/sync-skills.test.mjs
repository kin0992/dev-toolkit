import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, expect, test } from 'vitest';

const scriptPath = fileURLToPath(new URL('./sync-skills.mjs', import.meta.url));
const temporaryDirectories = [];
const policy = '# Writing quality\n\nDescribe only supported changes.\n';
const skill = `---
name: commit-message
description: Write a commit message.
---

Follow [writing quality](references/writing-quality.md).
`;

const temporaryDirectory = () => {
  const root = mkdtempSync(join(tmpdir(), 'dev-toolkit-skills-'));
  temporaryDirectories.push(root);
  return root;
};

afterEach(() => {
  for (const root of temporaryDirectories.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

const fixture = () => {
  const root = temporaryDirectory();
  const write = (path, content) => {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  };

  write('packages/skills/shared/writing-quality.md', policy);
  write(
    'packages/skills/package.json',
    JSON.stringify({
      exports: { './git/commit-message': './src/git/commit-message/SKILL.md' },
    }),
  );
  write('packages/skills/src/git/commit-message/SKILL.md', skill);
  write(
    '.github/plugin/marketplace.json',
    JSON.stringify({
      plugins: [
        { name: 'git-skills', source: './plugins/git-skills' },
        { name: 'project-manager', source: './plugins/project-manager' },
      ],
    }),
  );

  for (const directory of ['.github', '.claude-plugin']) {
    write(
      `plugins/git-skills/${directory}/plugin.json`,
      JSON.stringify({ name: 'git-skills', skills: ['./skills/commit-message/'] }),
    );
    write(
      `plugins/project-manager/${directory}/plugin.json`,
      JSON.stringify({ name: 'project-manager', agents: ['./agents/triage.agent.md'] }),
    );
  }

  write('plugins/git-skills/README.md', 'Handwritten installation instructions.\n');
  write(
    'plugins/project-manager/agents/triage.agent.md',
    '# Triage\n\n<!-- writing-quality:start -->\n<!-- writing-quality:end -->\n',
  );
  mkdirSync(join(root, 'plugins/git-skills/skills'), { recursive: true });
  symlinkSync(
    '../../../packages/skills/src/git/commit-message',
    join(root, 'plugins/git-skills/skills/commit-message'),
  );
  mkdirSync(join(root, 'scripts'), { recursive: true });
  copyFileSync(scriptPath, join(root, 'scripts/sync-skills.mjs'));

  return {
    root,
    write,
    run: (...args) =>
      spawnSync(process.execPath, [join(root, 'scripts/sync-skills.mjs'), ...args], {
        encoding: 'utf8',
      }),
  };
};

test('an installed plugin includes its writing reference without the monorepo', () => {
  const source = fixture();
  const result = source.run();
  expect(result.status, result.stderr).toBe(0);

  const installed = temporaryDirectory();
  cpSync(join(source.root, 'plugins/git-skills'), installed, { recursive: true });
  const installedSkill = join(installed, 'skills/commit-message');

  expect(lstatSync(installedSkill).isDirectory()).toBe(true);
  expect(readFileSync(join(installedSkill, 'SKILL.md'), 'utf8')).toBe(skill);
  expect(readFileSync(join(installedSkill, 'references/writing-quality.md'), 'utf8')).toBe(
    '# Writing quality\n\nDescribe only supported changes.\n',
  );
});

test('check reports missing payloads without replacing links or writing references', () => {
  const source = fixture();
  const result = source.run('--check');

  expect(result.status).toBe(1);
  expect(result.stdout + result.stderr).toContain('writing-quality.md');
  expect(
    lstatSync(join(source.root, 'plugins/git-skills/skills/commit-message')).isSymbolicLink(),
  ).toBe(true);
  expect(
    existsSync(
      join(source.root, 'packages/skills/src/git/commit-message/references/writing-quality.md'),
    ),
  ).toBe(false);
});

test('the agent receives the shared policy without a runtime resource lookup', () => {
  const source = fixture();
  const result = source.run();

  expect(result.status, result.stderr).toBe(0);
  expect(
    readFileSync(join(source.root, 'plugins/project-manager/agents/triage.agent.md'), 'utf8'),
  ).toBe(
    '# Triage\n\n<!-- writing-quality:start -->\n\n# Writing quality\n\nDescribe only supported changes.\n\n<!-- writing-quality:end -->\n',
  );
});

test('sync preserves binary assets and handwritten plugin files', () => {
  const source = fixture();
  source.write(
    'packages/skills/src/git/commit-message/assets/example.bin',
    Buffer.from([0, 128, 255, 10]),
  );
  const result = source.run();

  expect(result.status, result.stderr).toBe(0);
  expect(
    readFileSync(join(source.root, 'plugins/git-skills/skills/commit-message/assets/example.bin')),
  ).toEqual(Buffer.from([0, 128, 255, 10]));
  expect(readFileSync(join(source.root, 'plugins/git-skills/README.md'), 'utf8')).toBe(
    'Handwritten installation instructions.\n',
  );
});

test.each([
  [
    'non-string skill export',
    (source) =>
      source.write(
        'packages/skills/package.json',
        JSON.stringify({
          exports: { './git/commit-message': ['./src/git/commit-message/SKILL.md'] },
        }),
      ),
    'Invalid skill export',
  ],
  [
    'missing skill resource',
    (source) =>
      source.write(
        'packages/skills/src/git/commit-message/SKILL.md',
        'Read [context](references/missing.md).\n',
      ),
    'Missing resource',
  ],
  [
    'resource outside the skill',
    (source) =>
      source.write(
        'packages/skills/src/git/commit-message/SKILL.md',
        'Read [context](../../outside.md).\n',
      ),
    'escapes',
  ],
  [
    'component outside the plugin',
    (source) =>
      source.write(
        'plugins/git-skills/.github/plugin.json',
        JSON.stringify({
          name: 'git-skills',
          skills: ['./../../packages/skills/src/git/commit-message/'],
        }),
      ),
    'escapes',
  ],
  [
    'missing agent component',
    (source) =>
      source.write(
        'plugins/project-manager/.github/plugin.json',
        JSON.stringify({ name: 'project-manager', agents: ['./agents/missing.agent.md'] }),
      ),
    'Missing component',
  ],
  [
    'linked destination parent',
    (source) => {
      const parent = join(source.root, 'plugins/git-skills/skills');
      renameSync(parent, join(source.root, 'old-skills'));
      symlinkSync(temporaryDirectory(), parent);
    },
    'symlink',
  ],
  [
    'missing agent policy markers',
    (source) => source.write('plugins/project-manager/agents/triage.agent.md', '# Triage\n'),
    'marker pair',
  ],
])('sync rejects %s before writing any generated files', (_name, arrange, message) => {
  const source = fixture();
  arrange(source);
  const result = source.run();

  expect(result.status).toBe(1);
  expect(result.stderr).toContain(message);
  expect(
    existsSync(
      join(source.root, 'packages/skills/src/git/commit-message/references/writing-quality.md'),
    ),
  ).toBe(false);
});

test('repeated sync and successful checks leave unchanged files untouched', () => {
  const source = fixture();
  expect(source.run().status).toBe(0);
  const generated = join(
    source.root,
    'plugins/git-skills/skills/commit-message/references/writing-quality.md',
  );
  utimesSync(generated, 1, 1);
  const before = statSync(generated).mtimeMs;

  expect(source.run().status).toBe(0);
  expect(source.run('--check').status).toBe(0);
  expect(statSync(generated).mtimeMs).toBe(before);
});

test('check reports content drift without repairing or rewriting it', () => {
  const source = fixture();
  expect(source.run().status).toBe(0);
  source.write(
    'plugins/git-skills/skills/commit-message/references/writing-quality.md',
    'Edited generated copy.\n',
  );

  const result = source.run('--check');
  expect(result.status).toBe(1);
  expect(result.stdout).toContain('skills/commit-message/references/writing-quality.md');
  expect(
    readFileSync(
      join(source.root, 'plugins/git-skills/skills/commit-message/references/writing-quality.md'),
      'utf8',
    ),
  ).toBe('Edited generated copy.\n');
});

test('unexpected generated files require explicit review rather than silent deletion', () => {
  const source = fixture();
  expect(source.run().status).toBe(0);
  source.write('plugins/git-skills/skills/commit-message/references/obsolete.md', 'Review me.\n');

  const result = source.run();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Unexpected generated file');
  expect(
    readFileSync(
      join(source.root, 'plugins/git-skills/skills/commit-message/references/obsolete.md'),
      'utf8',
    ),
  ).toBe('Review me.\n');
});

test.each([
  ['git-skills', ['commit-message', 'pr-title-description', 'branch-name']],
  ['engineering-skills', ['review-pr-comments']],
  ['project-manager', []],
])('%s ships independently readable components for both clients', (name, skills) => {
  const installed = temporaryDirectory();
  cpSync(fileURLToPath(new URL(`../plugins/${name}`, import.meta.url)), installed, {
    recursive: true,
  });
  const shared = readFileSync(
    fileURLToPath(new URL('../packages/skills/shared/writing-quality.md', import.meta.url)),
    'utf8',
  );

  for (const directory of ['.github', '.claude-plugin']) {
    const manifest = JSON.parse(readFileSync(join(installed, directory, 'plugin.json'), 'utf8'));
    expect(manifest.name).toBe(name);
    expect(manifest.skills ?? []).toEqual(skills.map((skillName) => `./skills/${skillName}/`));
    for (const component of [...(manifest.skills ?? []), ...(manifest.agents ?? [])]) {
      const path = resolve(installed, component);
      expect(realpathSync(path).startsWith(`${realpathSync(installed)}${sep}`)).toBe(true);
    }
    for (const skillName of skills) {
      const root = join(installed, 'skills', skillName);
      expect(lstatSync(root).isDirectory()).toBe(true);
      expect(readFileSync(join(root, 'references/writing-quality.md'), 'utf8')).toBe(shared);
    }
  }
  if (name === 'project-manager') {
    const agent = readFileSync(join(installed, 'agents/triage.agent.md'), 'utf8');
    expect(
      agent.split('<!-- writing-quality:start -->\n')[1].split('<!-- writing-quality:end -->')[0],
    ).toBe(`\n${shared}\n`);
  }
});
