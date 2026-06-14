import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const appJs = readFileSync(join(root, 'assets/js/app.js'), 'utf8');

const checks = [
  {
    label: 'debounce helper is defined',
    pattern: /function\s+debounce\s*\(\s*fn\s*,\s*delay\s*\)\s*\{/,
  },
  {
    label: 'gallery search input is debounced',
    pattern: /searchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*applySearch\s*,\s*200\s*\)\s*\)/,
  },
  {
    label: 'master color list search input is debounced',
    pattern: /masterSearchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*renderMasterList\s*,\s*200\s*\)\s*\)/,
  },
];

const failures = checks
  .filter((check) => !check.pattern.test(appJs))
  .map((check) => check.label);

if (failures.length) {
  throw new Error(`Search debounce verification failed:\n${failures.join('\n')}`);
}

console.log('Search debounce verified.');
