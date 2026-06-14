import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pages = [
  'index.html',
  'explorer.html',
  'dictionary.html',
  'palettes.html',
  'gradients.html',
  'uses.html',
  'style-lab.html',
  'generator.html',
  'favorites.html',
  'skills.html',
];

const genericAssetPages = [
  'index.html',
  'explorer.html',
  'dictionary.html',
  'palettes.html',
  'gradients.html',
  'uses.html',
  'style-lab.html',
  'generator.html',
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function searchInputs(html) {
  return [...html.matchAll(/<input\b[^>]*type="search"[^>]*>/g)].map((match) => match[0]);
}

for (const page of pages) {
  const html = read(page);
  for (const input of searchInputs(html)) {
    const hasGenericSuggestions = /\bdata-color-suggest\b/.test(input);
    const hasGeneratorSuggestions = /\bdata-generator-search\b/.test(input)
      && /\bdata-generator-search-suggestions\b/.test(html);

    if (!hasGenericSuggestions && !hasGeneratorSuggestions) {
      fail(`${page}: search input missing color suggestions: ${input}`);
    }
  }
}

for (const page of genericAssetPages) {
  const html = read(page);
  if (!html.includes('assets/css/color-suggestions.css?v=20260614-1')) {
    fail(`${page}: missing color suggestions stylesheet`);
  }
  if (!html.includes('assets/js/color-search-suggestions.js?v=20260614-1')) {
    fail(`${page}: missing color suggestions script`);
  }

  const imagesIndex = html.indexOf('assets/data/images.js');
  const suggestIndex = html.indexOf('assets/js/color-search-suggestions.js');
  if (imagesIndex === -1 || suggestIndex === -1 || suggestIndex < imagesIndex) {
    fail(`${page}: color suggestions script must load after images data`);
  }
}

const helperJs = read('assets/js/color-search-suggestions.js');
[
  'window.ZH_COLOR_SEARCH',
  'function rankedImages',
  'function matchesImage',
  'function matchesText',
  'color-suggestion-pick',
].forEach((snippet) => {
  if (!helperJs.includes(snippet)) fail(`color-search-suggestions.js: missing ${snippet}`);
});

const helperCss = read('assets/css/color-suggestions.css');
[
  '.color-suggest-panel',
  '.color-suggest-option',
  '.color-suggest-effect',
  '.color-suggest-empty',
].forEach((snippet) => {
  if (!helperCss.includes(snippet)) fail(`color-suggestions.css: missing ${snippet}`);
});

if (failures.length) {
  throw new Error(`Color search suggestions verification failed:\n${failures.join('\n')}`);
}

console.log('Color search suggestions verified.');
