import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

const checks = [
  {
    file: 'assets/js/app.js',
    expectations: [
      ['setupAutoLoad', /function setupAutoLoad\(/],
      ['IntersectionObserver', /new IntersectionObserver/],
      ['appendGalleryItems from observer', /appendGalleryItems\(GALLERY_PAGE_SIZE\)/],
    ],
  },
  {
    file: 'assets/js/palettes.js',
    expectations: [
      ['setupAutoLoad', /function setupAutoLoad\(/],
      ['IntersectionObserver', /new IntersectionObserver/],
      ['appendPalettes from observer', /appendPalettes\(PALETTE_LIMIT_STEP\)/],
    ],
  },
  {
    file: 'assets/css/styles.css',
    expectations: [
      ['hidden display rule', /\[hidden\]\s*\{[\s\S]*?display:\s*none\s*!important;[\s\S]*?\}/],
    ],
  },
  {
    file: 'assets/css/palettes.css',
    expectations: [
      ['hidden display rule', /\[hidden\]\s*\{[\s\S]*?display:\s*none\s*!important;[\s\S]*?\}/],
    ],
  },
];

const failures = checks.flatMap(({ file, expectations }) => {
  const source = readFileSync(join(root, file), 'utf8');
  return expectations
    .filter(([, pattern]) => !pattern.test(source))
    .map(([label]) => `${file}: missing ${label}`);
});

if (failures.length) {
  throw new Error(`Auto-load verification failed:\n${failures.join('\n')}`);
}

console.log('Auto-load verification passed.');
