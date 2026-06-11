import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = readFileSync(join(root, 'assets/js/palettes.js'), 'utf8');

const checks = [
  ['random rank map', /let randomRanks = new Map\(\);/],
  ['Fisher-Yates rank builder', /function shuffledPaletteRanks\(palettes\)[\s\S]*for \(let index = ids\.length - 1; index > 0; index -= 1\)/],
  ['shuffle action function', /function shuffleCurrentPaletteOrder\(\)/],
  ['shuffle button uses real shuffle', /shuffleButton\?\.addEventListener\('click'[\s\S]*shuffleCurrentPaletteOrder\(\);/],
  ['random feed uses real shuffle', /if \(currentFeed === 'random'\) shuffleCurrentPaletteOrder\(\);/],
  ['no Date.now seed shuffle', /randomSeed|seededScore\(value/],
];

const failures = checks
  .filter(([label, pattern], index) => (index === checks.length - 1 ? pattern.test(source) : !pattern.test(source)))
  .map(([label]) => label);

if (failures.length) {
  throw new Error(`Palette shuffle verification failed:\n${failures.join('\n')}`);
}

console.log('Palette shuffle verification passed.');
