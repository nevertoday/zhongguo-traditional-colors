import { readFileSync } from 'node:fs';

const js = readFileSync('assets/js/terminal.js', 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

if (!js.includes("colorDialogSearch?.addEventListener('input', debounce(renderColorDialog, 120))")) {
  fail('assets/js/terminal.js: color dialog search should merge rapid input before rebuilding candidates');
}
if (/colorDialogSearch\?\.addEventListener\('input',\s*renderColorDialog\)/.test(js)) {
  fail('assets/js/terminal.js: color dialog search still contains an unthrottled full render');
}
if (!js.includes('let colorDialogOpener = null') || !js.includes("colorDialog?.addEventListener('close'")) {
  fail('assets/js/terminal.js: color dialog should restore focus to its real opener');
}

if (failures.length) {
  throw new Error(`Terminal UX verification failed:\n${failures.join('\n')}`);
}

console.log('Terminal UX verified.');
