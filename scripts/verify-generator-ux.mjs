import { readFileSync } from 'node:fs';

const html = readFileSync('generator.html', 'utf8');
const js = readFileSync('assets/js/generator.js', 'utf8');
const css = readFileSync('assets/css/generator.css', 'utf8');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const topSearchInput = html.match(/<input\b[^>]*data-generator-search[^>]*>/)?.[0] || '';
if (!/\bdata-color-suggest\b/.test(topSearchInput)) {
  fail('generator.html: top generator search should use shared color suggestions');
}
if (/data-generator-search-suggestions/.test(html)) {
  fail('generator.html: top generator search should not render a duplicate private suggestion panel');
}
if (!html.includes('class="generator-more"')) {
  fail('generator.html: missing compact more menu');
}

for (const token of [
  'rankedColorMatches',
  'color-suggestion-pick',
  'pickSearchSuggestion',
  'async function copyText(text)',
  'const copied = await copyText',
  "'复制失败，请手动复制'",
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
