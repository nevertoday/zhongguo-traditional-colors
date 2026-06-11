import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const js = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');
const css = readFileSync(join(root, 'assets/css/palettes.css'), 'utf8');

const checks = [
  ['swatch index custom property', /--swatch-index:\s*\$\{index\}/, js],
  ['variable palette rows', /grid-template-rows:\s*var\(--stack-0,\s*41fr\)\s+var\(--stack-1,\s*26fr\)\s+var\(--stack-2,\s*18fr\)\s+var\(--stack-3,\s*15fr\)/, css],
  ['square palette stack', /aspect-ratio:\s*1\s*\/\s*1;/, css],
  ['per-card stack style', /style="\$\{paletteStackStyle\(palette\)\}"/, js],
  ['top-down label delay', /transition-delay:\s*calc\(var\(--swatch-index\)\s*\*\s*55ms\)/, css],
  ['hover reveals from above', /translateY\(-8px\)/, css],
  ['focus-within reveals labels', /\.palette-card:focus-within\s+\.palette-swatch-label/, css],
];

const patternBlock = js.match(/const STACK_PATTERNS = \[([\s\S]*?)\];/);
if (!patternBlock) {
  throw new Error('Palette stack motion verification failed:\nmissing STACK_PATTERNS');
}

const patterns = [...patternBlock[1].matchAll(/\[(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\]/g)]
  .map((match) => match.slice(1).map(Number));

const uniquePatterns = new Set(patterns.map((pattern) => pattern.join(',')));
const badPatterns = patterns.filter((pattern) => new Set(pattern).size !== pattern.length || pattern.reduce((sum, value) => sum + value, 0) !== 100);

if (patterns.length < 4 || uniquePatterns.size < 4 || badPatterns.length) {
  throw new Error('Palette stack motion verification failed:\nstack patterns must be varied, non-equal, and sum to 100');
}

const failures = checks
  .filter(([, pattern, source]) => !pattern.test(source))
  .map(([label]) => label);

if (failures.length) {
  throw new Error(`Palette stack motion verification failed:\n${failures.join('\n')}`);
}

console.log('Palette stack motion verification passed.');
