import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = {
  shared: readFileSync(join(root, 'assets/js/shared-chrome.js'), 'utf8'),
  app: readFileSync(join(root, 'assets/js/app.js'), 'utf8'),
  dictionary: readFileSync(join(root, 'assets/js/dictionary.js'), 'utf8'),
  generator: readFileSync(join(root, 'assets/js/generator.js'), 'utf8'),
  palettes: readFileSync(join(root, 'assets/js/palettes.js'), 'utf8'),
  uses: readFileSync(join(root, 'assets/js/uses.js'), 'utf8'),
};

const checks = [
  {
    source: 'shared',
    label: 'shared debounce helper is defined',
    pattern: /function\s+debounce\s*\(\s*fn\s*,\s*delay\s*\)\s*\{/,
  },
  {
    source: 'app',
    label: 'gallery search input is debounced',
    pattern: /searchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*applySearch\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'app',
    label: 'master color list search input is debounced',
    pattern: /masterSearchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*renderMasterList\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'app',
    label: 'style color picker search input is debounced',
    pattern: /styleColorPickerSearch\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*renderStyleColorPicker\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'dictionary',
    label: 'dictionary search input is debounced',
    pattern: /dictionarySearch\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*renderDictionary\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'generator',
    label: 'generator color dialog search input is debounced',
    pattern: /colorDialogSearch\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*renderColorDialog\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'palettes',
    label: 'palettes search input is debounced',
    pattern: /searchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*\(\)\s*=>\s*rerender\(\)\s*,\s*200\s*\)\s*\)/,
  },
  {
    source: 'uses',
    label: 'uses search input is debounced',
    pattern: /searchInput\?\.addEventListener\(\s*['"]input['"]\s*,\s*debounce\(\s*\(\)\s*=>\s*rerender\(\)\s*,\s*200\s*\)\s*\)/,
  },
];

const failures = checks
  .filter((check) => !check.pattern.test(files[check.source]))
  .map((check) => check.label);

if (failures.length) {
  throw new Error(`Search debounce verification failed:\n${failures.join('\n')}`);
}

console.log('Search debounce verified.');
