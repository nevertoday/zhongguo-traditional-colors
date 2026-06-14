import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pages = [
  'index.html',
  'dictionary.html',
  'style-lab.html',
  'generator.html',
  'palettes.html',
  'gradients.html',
  'uses.html',
  'favorites.html',
  'skills.html',
];

const failures = [];

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*src="assets\/(?:js|data)\/[^"]+"[^>]*><\/script>/g)]
    .map((match) => match[0]);

  for (const script of scripts) {
    if (!/\sdefer(?:\s|>|=)/.test(script)) {
      failures.push(`${page}: local asset script should use defer: ${script}`);
    }
  }
}

if (failures.length) {
  throw new Error(`Deferred script verification failed:\n${failures.join('\n')}`);
}

console.log('Deferred local scripts verified.');
