/*
 * Verifies the generated SEO artifacts: per-color pages, sitemap.xml, robots.txt
 * and the meta tags on the main pages. Run after build-color-pages.mjs.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://colors.xiaoxiaodong.ai';

const failures = [];
function fail(message) {
  failures.push(message);
}

function read(relPath) {
  return readFileSync(path.join(ROOT, relPath), 'utf8');
}

function loadBrowserData(relPath, key) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(relPath), sandbox, { filename: relPath });
  return sandbox.window[key];
}

const images = loadBrowserData('assets/data/images.js', 'TRADITIONAL_COLOR_IMAGES') || [];
if (!images.length) fail('images.js: no colors loaded');

// 1. Every color has a page + a share card.
const colorsDir = path.join(ROOT, 'colors');
if (!existsSync(colorsDir)) {
  fail('colors/: directory missing — run build-color-pages.mjs');
} else {
  const htmlFiles = readdirSync(colorsDir).filter((file) => file.endsWith('.html'));
  if (htmlFiles.length !== images.length) {
    fail(`colors/: expected ${images.length} HTML pages, found ${htmlFiles.length}`);
  }
  const cardsDir = path.join(colorsDir, 'cards');
  const svgFiles = existsSync(cardsDir) ? readdirSync(cardsDir).filter((file) => file.endsWith('.svg')) : [];
  if (svgFiles.length !== images.length) {
    fail(`colors/cards/: expected ${images.length} SVG cards, found ${svgFiles.length}`);
  }

  // Spot-check the first color page for required structure.
  const first = images[0];
  const name = first.file.replace(/\.[^.]+$/, '').replace(/^\d{3}-/, '');
  const slug = `${first.id}-${name}`;
  const pagePath = path.join(colorsDir, `${slug}.html`);
  if (!existsSync(pagePath)) {
    fail(`colors/${slug}.html: sample page missing`);
  } else {
    const page = readFileSync(pagePath, 'utf8');
    const requiredTokens = [
      '<link rel="canonical"',
      `${SITE}/colors/`,
      'property="og:image"',
      'name="twitter:card"',
      'application/ld+json',
      '"@type":"BreadcrumbList"',
      '"@type":"CreativeWork"',
      'data-base="../"',
      'data-current-page="dictionary"',
      '../assets/css/styles.css',
      '../assets/css/color-page.css',
      '../assets/js/shared-chrome.js',
      '../assets/js/color-page.js',
      'class="relation-swatch"',
      'data-copy-value',
    ];
    for (const token of requiredTokens) {
      if (!page.includes(token)) fail(`colors/${slug}.html: missing ${token}`);
    }
  }
}

// 2. sitemap.xml: valid namespace, main pages present, all color pages present, favorites excluded.
if (!existsSync(path.join(ROOT, 'sitemap.xml'))) {
  fail('sitemap.xml: missing');
} else {
  const sitemap = read('sitemap.xml');
  if (!sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) {
    fail('sitemap.xml: wrong/missing urlset namespace');
  }
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  const expected = images.length + 11; // 11 indexable main pages (favorites excluded)
  if (locCount !== expected) {
    fail(`sitemap.xml: expected ${expected} <loc> entries, found ${locCount}`);
  }
  if (!sitemap.includes(`<loc>${SITE}/</loc>`)) fail('sitemap.xml: missing homepage URL');
  if (sitemap.includes('favorites.html')) fail('sitemap.xml: favorites.html should be excluded');
}

// 3. robots.txt references the sitemap.
if (!existsSync(path.join(ROOT, 'robots.txt'))) {
  fail('robots.txt: missing');
} else if (!read('robots.txt').includes(`Sitemap: ${SITE}/sitemap.xml`)) {
  fail('robots.txt: missing Sitemap directive');
}

// 4. Main pages carry canonical + Open Graph; favorites is noindex.
const indexablePages = ['index.html', 'explorer.html', 'dictionary.html', 'palettes.html', 'generator.html', 'theme-forge.html', 'terminal.html', 'style-lab.html', 'gradients.html', 'uses.html', 'skills.html'];
for (const page of indexablePages) {
  const source = read(page);
  if (!source.includes('<link rel="canonical"')) fail(`${page}: missing canonical`);
  if (!source.includes('property="og:title"')) fail(`${page}: missing og:title`);
  if (!source.includes('name="twitter:card"')) fail(`${page}: missing twitter:card`);
}
if (read('index.html').indexOf('"@type":"WebSite"') === -1) fail('index.html: missing WebSite JSON-LD');
if (!read('favorites.html').includes('content="noindex')) fail('favorites.html: should be noindex');

// Color pages follow the site's sharp-corner design language: no rounded
// rectangles (50% circles are allowed, matching styles.css).
const colorCss = read('assets/css/color-page.css');
const roundedRects = (colorCss.match(/border-radius:\s*[^;]+/gi) || []).filter((rule) => !/:\s*50%/.test(rule));
if (roundedRects.length) {
  fail(`color-page.css: rounded corners violate the sharp-corner design (${roundedRects.join('; ')})`);
}

if (failures.length) {
  console.error('Color page SEO verification failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Color page SEO verified: ${images.length} pages, sitemap, robots, main-page meta.`);
}
