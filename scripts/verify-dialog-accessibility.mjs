import { readFileSync } from 'node:fs';

const pages = ['index.html', 'dictionary.html', 'style-lab.html', 'generator.html', 'terminal.html'];
const failures = [];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const dialogs = [...html.matchAll(/<dialog\b[^>]*>/g)].map((match) => match[0]);
  for (const dialog of dialogs) {
    const labelledBy = dialog.match(/\baria-labelledby="([^"]+)"/)?.[1];
    const hasLabel = /\baria-label="[^"]+"/.test(dialog);
    if (!labelledBy && !hasLabel) {
      failures.push(`${page}: dialog is missing an accessible name: ${dialog}`);
      continue;
    }
    if (labelledBy && !new RegExp(`\\bid="${labelledBy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html)) {
      failures.push(`${page}: dialog aria-labelledby target does not exist: ${labelledBy}`);
    }
  }
}

const generator = readFileSync('generator.html', 'utf8');
if (generator.includes('<form method="dialog"')) {
  failures.push('generator.html: search dialogs must not implicitly close when Enter submits a method=dialog form');
}

const appJs = readFileSync('assets/js/app.js', 'utf8');
if (!appJs.includes('let styleColorDialogOpener = null') || !appJs.includes("styleColorDialog?.addEventListener('close'")) {
  failures.push('assets/js/app.js: style color dialog should restore focus after its trigger is rerendered');
}

const dictionaryJs = readFileSync('assets/js/dictionary.js', 'utf8');
if (!dictionaryJs.includes('let detailDialogOpener = null') || !dictionaryJs.includes("detailDialog?.addEventListener('close'")) {
  failures.push('assets/js/dictionary.js: color detail dialog should restore focus to its opener');
}

if (failures.length) {
  throw new Error(`Dialog accessibility verification failed:\n${failures.join('\n')}`);
}

console.log('Dialog accessibility verified.');
