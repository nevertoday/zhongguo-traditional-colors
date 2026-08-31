import { readFileSync } from 'node:fs';

const js = readFileSync('assets/js/favorites.js', 'utf8');
const css = readFileSync('assets/css/favorites.css', 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const token of [
  'let clearArmed = false',
  'function resetClearConfirmation()',
  'function armClearConfirmation()',
  'if (!clearArmed)',
  'window.setTimeout(resetClearConfirmation, 4000)',
  "clearButton?.addEventListener('blur'",
  "clearButton?.addEventListener('keydown'",
  "event.key !== 'Escape'",
]) {
  if (!js.includes(token)) fail(`assets/js/favorites.js: missing safe clear behavior (${token})`);
}

if (!css.includes('.favorites-clear[data-confirming="true"]')) {
  fail('assets/css/favorites.css: clear confirmation needs a visible armed state');
}

if (failures.length) {
  throw new Error(`Favorites UX verification failed:\n${failures.join('\n')}`);
}

console.log('Favorites UX verified.');
