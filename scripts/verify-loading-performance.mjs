import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const index = readFileSync('index.html', 'utf8');
const app = readFileSync('assets/js/app.js', 'utf8');
const failures = [];

function fail(message) {
  failures.push(message);
}

const qrImages = [...index.matchAll(/<img\b[^>]*docs\/images\/(?:wechat-reward-qr|alipay-reward-qr|buy-me-a-coffee-qr)\.png[^>]*>/g)]
  .map((match) => match[0]);
if (qrImages.length !== 3 || qrImages.some((image) => !/\bloading="lazy"/.test(image) || !/\bdecoding="async"/.test(image))) {
  fail('index.html: all below-fold support QR images should load lazily and decode asynchronously');
}

const previewImage = index.match(/<img\b[^>]*data-hero-preview-image[^>]*>/)?.[0] || '';
if (!/\bwidth="1086"/.test(previewImage) || !/\bheight="1448"/.test(previewImage)) {
  fail('index.html: hero preview image should reserve its intrinsic aspect ratio');
}

for (const token of [
  "rowIndex < 2 ? 'eager' : 'lazy'",
  "tabindex=\"-1\" aria-hidden=\"true\"",
  "fetchpriority=\"low\"",
  'imageMarkup(image, rowIndex, true)',
]) {
  if (!app.includes(token)) fail(`assets/js/app.js: hero mosaic loading behavior missing ${token}`);
}

function collectRuntimeHtml(directory = '.') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'docs' || entry.name === 'node_modules') return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectRuntimeHtml(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

const fontStylesheetPattern = /<link\b(?=[^>]*fonts\.googleapis\.com\/css2)(?=[^>]*rel="stylesheet")[^>]*>/g;
for (const path of collectRuntimeHtml()) {
  const html = readFileSync(path, 'utf8');
  if (!html.includes('fonts.googleapis.com/css2')) continue;

  const fontLinks = [...html.matchAll(fontStylesheetPattern)].map((match) => match[0]);
  const nonBlocking = fontLinks.some((link) =>
    /\bmedia="print"/.test(link) && /\bonload="this\.media='all'"/.test(link));
  const noScriptFallback = /<noscript>\s*<link\b[^>]*fonts\.googleapis\.com\/css2[^>]*rel="stylesheet"[^>]*>\s*<\/noscript>/.test(html);

  if (!nonBlocking || !noScriptFallback) {
    fail(`${path}: Google Fonts should load without blocking first paint and retain a noscript fallback`);
  }
}

const colorPageBuilder = readFileSync('scripts/build-color-pages.mjs', 'utf8');
if (!/fonts\.googleapis\.com\/css2[^\n]*media="print"[^\n]*onload="this\.media='all'"/.test(colorPageBuilder)) {
  fail('scripts/build-color-pages.mjs: generated color pages should preserve non-blocking font loading');
}

if (failures.length) {
  throw new Error(`Loading performance verification failed:\n${failures.join('\n')}`);
}

console.log('Loading performance verified.');
