import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://colors.xiaoxiaodong.ai';
const INDEXABLE_ROOT_PAGES = [
  'index.html',
  'explorer.html',
  'dictionary.html',
  'palettes.html',
  'generator.html',
  'theme-forge.html',
  'terminal.html',
  'style-lab.html',
  'gradients.html',
  'uses.html',
  'daily-color-playground.html',
  'skills.html',
];
const COLOR_PAGE_COUNT = 742;
const HUE_FAMILY_HUB_COUNT = 8;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

async function read(relativePath) {
  return readFile(path.join(ROOT, relativePath), 'utf8');
}

function canonicalFor(page) {
  return page === 'index.html' ? `${SITE}/` : `${SITE}/${page}`;
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  return blocks.map((match) => JSON.parse(match[1]));
}

function localPathFromUrl(url) {
  const parsed = new URL(url);
  const pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/') return 'index.html';
  return pathname.replace(/^\//, '');
}

async function verifyRootPages() {
  for (const page of INDEXABLE_ROOT_PAGES) {
    const html = await read(page);
    assert(/<title>[^<]+<\/title>/.test(html), `${page}: missing title`);
    assert(/<meta name="description" content="[^"]+">/.test(html), `${page}: missing meta description`);
    assert(html.includes(`<link rel="canonical" href="${canonicalFor(page)}">`), `${page}: canonical mismatch`);
    assert(!/<meta name="robots" content="[^"]*noindex/i.test(html), `${page}: indexable page has noindex`);
    assert(extractJsonLd(html).length > 0, `${page}: missing JSON-LD`);
  }

  const favorites = await read('favorites.html');
  assert(/<meta name="robots" content="noindex,\s*follow">/i.test(favorites), 'favorites.html: must be noindex,follow');
}

async function verifySitemap() {
  const sitemap = await read('sitemap.xml');
  assert(sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'sitemap: missing image namespace');
  assert(!sitemap.includes('/favorites.html'), 'sitemap: favorites.html must not be listed');

  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedCount = INDEXABLE_ROOT_PAGES.length + 1 + HUE_FAMILY_HUB_COUNT + COLOR_PAGE_COUNT;
  assert(locs.length === expectedCount, `sitemap: expected ${expectedCount} URLs, found ${locs.length}`);
  assert((sitemap.match(/<lastmod>/g) || []).length === locs.length, 'sitemap: every URL needs lastmod');

  const imageCount = (sitemap.match(/<image:image>/g) || []).length;
  assert(imageCount >= 742, `sitemap: expected at least 742 image entries, found ${imageCount}`);

  for (const loc of locs) {
    await access(path.join(ROOT, localPathFromUrl(loc))).catch(() => fail(`sitemap: local file missing for ${loc}`));
  }
}

async function verifyColorPage() {
  const html = await read('colors/001-乳白.html');
  assert(html.includes('<h1>乳白</h1>'), 'color page: missing visible h1');
  assert(html.includes('alt="中国传统色 乳白 #F9F4DC 色卡"'), 'color page: missing descriptive color-card image alt');

  const jsonLd = extractJsonLd(html);
  const types = new Set(jsonLd.map((entry) => entry['@type']));
  assert(types.has('BreadcrumbList'), 'color page: missing BreadcrumbList JSON-LD');
  assert(types.has('DefinedTerm'), 'color page: missing DefinedTerm JSON-LD');
  const colorEntity = jsonLd.find((entry) => entry['@type'] === 'CreativeWork' || entry['@type'] === 'DefinedTerm' && entry.color);
  assert(colorEntity?.image?.['@type'] === 'ImageObject' || types.has('ImageObject'), 'color page: missing ImageObject JSON-LD');

  assert(colorEntity?.color === '#F9F4DC', 'color page: structured color entity needs color value');
  assert(Array.isArray(colorEntity?.additionalProperty) && colorEntity.additionalProperty.length >= 4, 'color page: structured color entity needs color value properties');
}

await verifyRootPages();
await verifySitemap();
await verifyColorPage();

console.log('SEO verification passed');
