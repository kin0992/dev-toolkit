import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const result = spawnSync(
  'copilot',
  [
    '--disable-builtin-mcps',
    '--no-custom-instructions',
    '--allow-tool',
    'read',
    '--add-dir',
    fileURLToPath(new URL('../packages/skills/src', import.meta.url)),
    ...process.argv.slice(2),
  ],
  { stdio: 'inherit' },
);

if (result.error) {
  throw result.error;
}
if (result.status === null) {
  throw new Error(`Copilot terminated by signal: ${result.signal}`);
}
process.exitCode = result.status;
