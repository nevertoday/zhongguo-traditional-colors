import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');

const forbidden = [
  ['fake popularity label', /label:\s*'热门'/],
  ['fake palette score field', /\bscore:\s*/],
  ['favorite count variable', /const count =/],
  ['favorite count rendering', /\$\{count\}/],
  ['score-based popular sort', /second\.score|first\.score|palette\.score/],
];

const failures = forbidden
  .filter(([, pattern]) => pattern.test(source))
  .map(([label]) => `assets/js/palettes.js: found ${label}`);

if (failures.length) {
  throw new Error(`Palette honesty verification failed:\n${failures.join('\n')}`);
}

console.log('Palette honesty verification passed.');
