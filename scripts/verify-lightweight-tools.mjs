import { readFileSync, statSync } from 'node:fs';

const skillsHtml = readFileSync('skills.html', 'utf8');
const skillsJs = readFileSync('assets/js/skills.js', 'utf8');
const dailyHtml = readFileSync('daily-color-playground.html', 'utf8');
const dailyCss = readFileSync('assets/css/daily.css', 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const forbidden of [
  'assets/js/app.js',
  'assets/js/favorites-store.js',
  'assets/data/images.js',
  'assets/data/harmonies.js',
  'assets/data/harmony-usage.js',
]) {
  if (skillsHtml.includes(forbidden)) fail(`skills.html: unused heavyweight dependency remains: ${forbidden}`);
}

if (!skillsHtml.includes('assets/js/skills.js') || statSync('assets/js/skills.js').size > 6000) {
  fail('skills.html: accordion should use the dedicated lightweight script');
}

const detailTags = [...skillsHtml.matchAll(/<div class="skill-detail"[^>]*>/g)].map((match) => match[0]);
if (detailTags.length !== 10 || detailTags.some((tag) => !/aria-hidden="true"/.test(tag) || !/\binert\b/.test(tag))) {
  fail('skills.html: all collapsed skill details should be absent from the accessibility and focus trees initially');
}

for (const token of [
  "detail.inert = !open",
  "event.key !== 'Escape'",
  "window.addEventListener('hashchange', openSkillFromHash)",
  "prefers-reduced-motion: reduce",
  "data-skill-toggle]')?.focus",
]) {
  if (!skillsJs.includes(token)) fail(`assets/js/skills.js: missing ${token}`);
}

if (!dailyHtml.includes('shared-chrome.js?v=20260628-1')) {
  fail('daily-color-playground.html: shared chrome version should match the rest of the site');
}
for (const token of [
  'async function writeClipboard(text)',
  "document.execCommand('copy')",
  "复制失败，请手动选择",
  'const copied = await writeClipboard(text)',
]) {
  if (!dailyHtml.includes(token)) fail(`daily-color-playground.html: clipboard feedback missing ${token}`);
}

if (!/@media \(max-width: 900px\), \(pointer: coarse\)[\s\S]*?\.seg-btn,[\s\S]*?min-height:\s*44px/.test(dailyCss)) {
  fail('assets/css/daily.css: daily controls should keep 44px coarse-pointer targets');
}

if (failures.length) {
  throw new Error(`Lightweight tool verification failed:\n${failures.join('\n')}`);
}

console.log('Lightweight Studio and daily-color UX verified.');
