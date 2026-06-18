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
  // index.html (大全) and family-*.html (hue hubs) are not per-color pages.
  const htmlFiles = readdirSync(colorsDir).filter((file) => file.endsWith('.html') && file !== 'index.html' && !file.startsWith('family-'));
  if (htmlFiles.length !== images.length) {
    fail(`colors/: expected ${images.length} HTML pages, found ${htmlFiles.length}`);
  }
  // 8 hue-family hub pages must exist with list + collection schema + breadcrumb.
  const HUB_SLUGS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'neutral'];
  for (const s of HUB_SLUGS) {
    const hubPath = path.join(colorsDir, `family-${s}.html`);
    if (!existsSync(hubPath)) { fail(`colors/family-${s}.html: hue hub missing`); continue; }
    const hub = readFileSync(hubPath, 'utf8');
    for (const token of ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"BreadcrumbList"', 'class="relation-swatch"', `${SITE}/colors/family-${s}.html`]) {
      if (!hub.includes(token)) fail(`colors/family-${s}.html: missing ${token}`);
    }
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
      'class="color-pager"',
      'href="index.html"',
      'id="about-title"',
      '"@type":"DefinedTerm"',
      '"@type":"ImageObject"',
      'loading="lazy"',
      '中国传统色大全',
      'family-',
    ];
    for (const token of requiredTokens) {
      if (!page.includes(token)) fail(`colors/${slug}.html: missing ${token}`);
    }
    // Image SEO: every color page must carry a thumbnail <img> with non-empty alt.
    if (!/<img [^>]*alt="[^"]+"/.test(page)) {
      fail(`colors/${slug}.html: missing <img> with non-empty alt (Google Images)`);
    }
  }

  // The static all-colors index must exist and link to color pages with real anchors.
  const indexPath = path.join(colorsDir, 'index.html');
  if (!existsSync(indexPath)) {
    fail('colors/index.html: static all-colors index missing — run build-color-pages.mjs');
  } else {
    const indexPage = readFileSync(indexPath, 'utf8');
    const indexTokens = [
      `<link rel="canonical" href="${SITE}/colors/"`,
      'class="relation-swatch"',
      '"@type":"CollectionPage"',
      '"@type":"ItemList"',
      '中国传统色大全',
    ];
    for (const token of indexTokens) {
      if (!indexPage.includes(token)) fail(`colors/index.html: missing ${token}`);
    }
    // Every color must be linked from the index (real <a href>, JS-free discovery path).
    const linked = (indexPage.match(/class="relation-swatch"/g) || []).length;
    if (linked !== images.length) {
      fail(`colors/index.html: expected ${images.length} color links, found ${linked}`);
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
  const expected = images.length + 20; // 11 main pages + colors/ index + 8 hue hubs (favorites excluded)
  if (locCount !== expected) {
    fail(`sitemap.xml: expected ${expected} <loc> entries, found ${locCount}`);
  }
  if (!sitemap.includes(`<loc>${SITE}/</loc>`)) fail('sitemap.xml: missing homepage URL');
  if (!sitemap.includes(`<loc>${SITE}/colors/</loc>`)) fail('sitemap.xml: missing colors/ index URL');
  if (sitemap.includes('favorites.html')) fail('sitemap.xml: favorites.html should be excluded');
  // Image sitemap: namespace + one image:image per color page.
  if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    fail('sitemap.xml: missing image sitemap namespace');
  }
  const imageCount = (sitemap.match(/<image:loc>/g) || []).length;
  if (imageCount !== images.length) {
    fail(`sitemap.xml: expected ${images.length} <image:loc> entries, found ${imageCount}`);
  }
  // <lastmod> is the one sitemap field Google/Bing actually use to schedule crawl.
  const lastmodCount = (sitemap.match(/<lastmod>/g) || []).length;
  if (lastmodCount !== locCount) {
    fail(`sitemap.xml: expected a <lastmod> on every URL (${locCount}), found ${lastmodCount}`);
  }
}

// 3. robots.txt references the sitemap.
if (!existsSync(path.join(ROOT, 'robots.txt'))) {
  fail('robots.txt: missing');
} else if (!read('robots.txt').includes(`Sitemap: ${SITE}/sitemap.xml`)) {
  fail('robots.txt: missing Sitemap directive');
}

// 3b. AI-discovery files exist and list the colors.
for (const f of ['llms.txt', 'llms-full.txt']) {
  if (!existsSync(path.join(ROOT, f))) fail(`${f}: missing — run build-color-pages.mjs`);
}
if (existsSync(path.join(ROOT, 'llms-full.txt'))) {
  const full = read('llms-full.txt');
  const hexCount = (full.match(/#[0-9A-Fa-f]{6}/g) || []).length;
  if (hexCount < images.length) {
    fail(`llms-full.txt: expected >= ${images.length} colors, found ${hexCount} hex values`);
  }
}

// 3c. index.html carries the consolidated entity graph (Organization + Person sameAs).
{
  const home = read('index.html');
  for (const token of ['"@type":"Organization"', '"@type":"Person"', '"@id":"https://colors.xiaoxiaodong.ai/#person"', 'x.com/xiaoxiaodong01']) {
    if (!home.includes(token)) fail(`index.html: missing entity-graph token ${token}`);
  }
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
