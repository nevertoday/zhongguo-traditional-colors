import { readFileSync } from 'node:fs';

const css = readFileSync('assets/css/explorer.css', 'utf8');
const js = readFileSync('assets/js/explorer.js', 'utf8');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const spectrumRule = css.match(/\.explorer-spectrum\s*\{[^}]+\}/s)?.[0] || '';
if (!/grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(min\(92px,\s*100%\),\s*1fr\)\)/.test(spectrumRule)) {
  fail('assets/css/explorer.css: spectrum should use compact auto-fill columns');
}
if (!/align-content:\s*start\s*;/.test(spectrumRule)) {
  fail('assets/css/explorer.css: spectrum should not vertically stretch sparse rows');
}

const buttonRule = css.match(/\.explorer-spectrum button\s*\{[^}]+\}/s)?.[0] || '';
if (!/height:\s*64px\s*;/.test(buttonRule)) {
  fail('assets/css/explorer.css: spectrum buttons need a fixed compact height');
}
if (/min-height:\s*86px\s*;/.test(buttonRule)) {
  fail('assets/css/explorer.css: spectrum buttons should not keep the tall legacy min-height');
}

const textRule = css.match(/\.explorer-spectrum span,\s*\.explorer-spectrum small\s*\{[^}]+\}/s)?.[0] || '';
if (!/white-space:\s*nowrap\s*;/.test(textRule)) {
  fail('assets/css/explorer.css: spectrum labels should stay single-line to avoid card expansion');
}

const hueRule = [...css.matchAll(/\.explorer-hues\s*\{[^}]+\}/gs)]
  .map((match) => match[0])
  .find((rule) => rule.includes('repeat(auto-fit')) || '';
const hueMinWidth = Number(hueRule.match(/grid-template-columns:\s*repeat\(auto-fit,\s*minmax\((\d+)px,\s*1fr\)\)/)?.[1]);
if (!Number.isFinite(hueMinWidth) || hueMinWidth < 44) {
  fail('assets/css/explorer.css: hue filters should keep 44px mobile tap targets');
}

if (!js.includes('const renderSearch = debounce(render, 120)')) {
  fail('assets/js/explorer.js: search should debounce the 742-item spectrum render');
}
if (!/els\.search\?\.addEventListener\('input',[\s\S]+state\.query\s*=\s*normalize\([\s\S]+renderSearch\(\)/.test(js)) {
  fail('assets/js/explorer.js: search input should update query immediately and schedule one merged render');
}

if (!process.exitCode) {
  console.log('Explorer layout verified.');
}
