import { readFileSync } from 'node:fs';

const html = readFileSync('generator.html', 'utf8');
const js = readFileSync('assets/js/generator.js', 'utf8');
const css = readFileSync('assets/css/generator.css', 'utf8');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!html.includes('data-generator-search-suggestions')) {
  fail('generator.html: missing search suggestion container');
}
if (!html.includes('class="generator-more"')) {
  fail('generator.html: missing compact more menu');
}

for (const token of [
  'rankedColorMatches',
  'renderSearchSuggestions',
  'data-generator-search-pick',
  'searchEffectLabel',
  'dictionary.html?q=',
]) {
  if (!js.includes(token)) fail(`assets/js/generator.js: missing ${token}`);
}

const boardRule = css.match(/\.generator-board\s*\{[^}]+\}/s)?.[0] || '';
if (!/gap:\s*0\s*;/.test(boardRule)) {
  fail('assets/css/generator.css: generator-board should remove hard inter-tile gap');
}
if (!/background:\s*transparent\s*;/.test(boardRule)) {
  fail('assets/css/generator.css: generator-board should not paint line color between tiles');
}

for (const token of [
  '.generator-search-wrap',
  '.generator-search-suggestions',
  '.generator-search-option',
  '.generator-search-effect',
  '.generator-search-detail',
  '.generator-more-menu',
]) {
  if (!css.includes(token)) fail(`assets/css/generator.css: missing ${token}`);
}

const mobileRule = css.match(/@media\s*\(max-width:\s*720px\)\s*\{[\s\S]+?@media/s)?.[0] || '';
if (!/\.generator-actions\s*\{[\s\S]+gap:\s*4px\s*;/.test(mobileRule)) {
  fail('assets/css/generator.css: mobile generator actions should stay compact');
}

if (!process.exitCode) {
  console.log('Generator UX verified.');
}
