import { readFileSync } from 'node:fs';

const js = readFileSync('assets/js/theme-forge.js', 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const token of [
  'async function copyText(text)',
  "copyButton.setAttribute('aria-busy', 'true')",
  'copyButton.disabled = true',
  "copyButton.removeAttribute('aria-busy')",
  "'复制失败 · 请手动选择'",
  'window.clearTimeout(copyTimer)',
]) {
  if (!js.includes(token)) fail(`assets/js/theme-forge.js: missing reliable copy feedback (${token})`);
}

if (/navigator\.clipboard\.writeText\([^)]*\);\s*const label/.test(js)) {
  fail('assets/js/theme-forge.js: must not report copy success before the clipboard promise resolves');
}

if (failures.length) {
  throw new Error(`Theme Forge UX verification failed:\n${failures.join('\n')}`);
}

console.log('Theme Forge UX verified.');
