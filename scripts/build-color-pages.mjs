/*
 * Generates one static, SEO-friendly HTML page per traditional color under /colors/,
 * plus a per-color SVG share card and a site-wide sitemap.xml.
 *
 * Each color page is fully static (content readable without JavaScript) and carries:
 *   - a unique <title>, meta description and canonical URL
 *   - Open Graph / Twitter card tags (image = the real color card PNG)
 *   - JSON-LD structured data (BreadcrumbList + a color CreativeWork)
 *   - the four color value formats (HEX / RGB / HSL / CMYK)
 *   - an internal-link network to related colors via the harmony relations
 *   - entry points into the interactive tools (generator / style-lab / uses)
 *
 * Data is read from the generated browser globals, matching the pattern used by
 * scripts/build-harmony-use-cases.mjs and scripts/build-readme.mjs.
 *
 * Run: node scripts/build-color-pages.mjs
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_FILE = path.join(ROOT, 'assets', 'data', 'images.js');
const HARMONIES_FILE = path.join(ROOT, 'assets', 'data', 'harmonies.js');
const USAGE_FILE = path.join(ROOT, 'assets', 'data', 'harmony-usage.js');
const COLORS_DIR = path.join(ROOT, 'colors');
const CARDS_DIR = path.join(COLORS_DIR, 'cards');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');

const SITE = 'https://colors.xiaoxiaodong.ai';
const ASSET_VERSION = '20260614-seo3';

// Root-level pages that also belong in the sitemap, with crawl priority hints.
const MAIN_PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'explorer.html', priority: '0.9', changefreq: 'weekly' },
  { path: 'dictionary.html', priority: '0.9', changefreq: 'weekly' },
  { path: 'palettes.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'generator.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'style-lab.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'gradients.html', priority: '0.7', changefreq: 'weekly' },
  { path: 'uses.html', priority: '0.7', changefreq: 'weekly' },
  { path: 'skills.html', priority: '0.7', changefreq: 'monthly' },
  // favorites.html is intentionally excluded: its content is per-visitor
  // localStorage, so it is empty for crawlers and marked noindex.
];

// Ordered relations rendered on each color page. Mirrors dictionary.js RELATION_TYPES,
// but only the eleven that carry shared usage copy in harmony-usage.js drive sections.
const RELATION_TYPES = [
  { key: 'same', label: '同类' },
  { key: 'analogous', label: '邻近' },
  { key: 'complementary', label: '互补' },
  { key: 'splitComplementary', label: '分裂互补' },
  { key: 'triadic', label: '三角' },
  { key: 'tetradic', label: '四角' },
  { key: 'temperatureContrast', label: '冷暖' },
  { key: 'lighter', label: '明色' },
  { key: 'darker', label: '暗色' },
  { key: 'grayTone', label: '灰调' },
  { key: 'neutral', label: '中性' },
];

function loadBrowserData(source, filename) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename });
  return sandbox.window;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function colorName(image) {
  return image.file.replace(/\.[^.]+$/, '').replace(/^\d{3}-/, '');
}

function rgbFromHex(hex) {
  const match = hex?.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return null;
  const value = match[1];
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function hslFromRgb({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    if (max === green) hue = (blue - red) / delta + 2;
    if (max === blue) hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function cmykFromRgb({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const k = 1 - Math.max(red, green, blue);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - red - k) / (1 - k)) * 100),
    m: Math.round(((1 - green - k) / (1 - k)) * 100),
    y: Math.round(((1 - blue - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

// WCAG relative luminance, used to pick a readable text color over the swatch.
function readableText(hex) {
  const rgb = rgbFromHex(hex);
  if (!rgb) return '#111111';
  const luminance = [rgb.r, rgb.g, rgb.b]
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > 0.5 ? '#1a1a1a' : '#f7f7f4';
}

function lightnessLabel(lightness) {
  if (lightness >= 82) return '高明度';
  if (lightness >= 62) return '中高明度';
  if (lightness >= 42) return '中明度';
  if (lightness >= 26) return '中低明度';
  return '低明度';
}

function saturationLabel(saturation) {
  if (saturation >= 72) return '高饱和';
  if (saturation >= 42) return '中饱和';
  if (saturation >= 18) return '低饱和';
  return '近中性';
}

// Accurate, data-derived prose (no fabricated historical claims).
function toneNote(hsl, temperature) {
  if (!hsl) return '色值来自 742 色清单，可作为单色索引和配色锚点。';
  const notes = [];
  if (hsl.l >= 84) notes.push('适合留白、背景和轻量层级');
  else if (hsl.l <= 28) notes.push('适合标题、压重和结构线');
  else notes.push('适合做主色或稳定辅助色');

  if (hsl.s >= 72) notes.push('高饱和时少量使用更稳');
  else if (hsl.s <= 18) notes.push('灰调稳定，适合长内容');

  notes.push(`${temperature || '冷暖'}色倾向`);
  return `${notes.join('，')}。`;
}

// Builds the value rows from an already-resolved rgb/hsl so the displayed HSL
// matches the precomputed harmony.hsl used by the meta chips (single source).
function colorValues(hex, rgb, hsl) {
  if (!rgb) return [{ label: 'HEX', value: hex || '' }];
  const cmyk = cmykFromRgb(rgb);
  return [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];
}

// Page filename / URL slug for a color, e.g. "001-乳白".
function colorSlug(image) {
  return `${image.id}-${colorName(image)}`;
}

function colorPageUrl(image) {
  return `${SITE}/colors/${encodeURIComponent(colorSlug(image))}.html`;
}

function renderColorPage(image, harmony, context) {
  const { usage, imageById } = context;
  const name = colorName(image);
  const hex = image.hex;
  const ink = readableText(hex);
  const rgb = rgbFromHex(hex);
  const hsl = harmony?.hsl || (rgb ? hslFromRgb(rgb) : null);
  const hueFamily = harmony?.hueFamily || '';
  const temperature = harmony?.temperature || '';
  const values = colorValues(hex, rgb, hsl);
  const slug = colorSlug(image);
  const canonical = colorPageUrl(image);
  const ogImage = `${SITE}/${encodeURI(image.path)}`;

  const metaChips = [];
  if (hueFamily) metaChips.push(hueFamily);
  if (temperature) metaChips.push(`${temperature}色`);
  if (hsl) {
    metaChips.push(lightnessLabel(hsl.l));
    metaChips.push(saturationLabel(hsl.s));
  }

  const description = `中国传统色「${name}」的色值与配色：HEX ${hex}`
    + `${values[1] ? `、${values[1].value}` : ''}`
    + `${hueFamily ? `，${hueFamily}` : ''}${temperature ? `、${temperature}色调` : ''}。`
    + `查看同类、邻近、互补等配色关系，并一键用于配色生成、场景试色与用途卡片。`;

  const valuesMarkup = values.map((entry) => `
            <button type="button" class="color-value" data-copy-value="${escapeHtml(entry.value)}" title="复制 ${escapeHtml(entry.label)}">
              <span class="color-value-label">${escapeHtml(entry.label)}</span>
              <span class="color-value-text">${escapeHtml(entry.value)}</span>
            </button>`).join('');

  const chipsMarkup = metaChips
    .map((chip) => `<span class="color-chip">${escapeHtml(chip)}</span>`)
    .join('');

  const relationSections = RELATION_TYPES.map((relation) => {
    const ids = Array.isArray(harmony?.[relation.key]) ? harmony[relation.key] : [];
    const relatedColors = ids
      .map((id) => imageById.get(id))
      .filter(Boolean);
    if (!relatedColors.length) return '';

    const usageCopy = usage[relation.key];
    const intent = usageCopy?.intent ? `（${usageCopy.intent}）` : '';
    const direction = usageCopy?.direction ? `<p class="relation-direction">${escapeHtml(usageCopy.direction)}</p>` : '';
    const swatches = relatedColors.map((related) => {
      const relatedHref = `${encodeURIComponent(colorSlug(related))}.html`;
      return `
              <a class="relation-swatch" href="${relatedHref}" style="--swatch: ${escapeHtml(related.hex)}; --swatch-ink: ${readableText(related.hex)};">
                <span class="relation-swatch-name">${escapeHtml(colorName(related))}</span>
                <span class="relation-swatch-hex">${escapeHtml(related.hex)}</span>
              </a>`;
    }).join('');

    return `
          <section class="relation-block">
            <h3>${escapeHtml(relation.label)}<span class="relation-intent">${intent}</span></h3>
            ${direction}
            <div class="relation-swatches">${swatches}</div>
          </section>`;
  }).filter(Boolean).join('');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '色彩字典', item: `${SITE}/dictionary.html` },
      { '@type': 'ListItem', position: 3, name: `${name} ${hex}`, item: canonical },
    ],
  };

  const colorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${name}`,
    alternateName: hex,
    url: canonical,
    image: ogImage,
    inLanguage: 'zh-CN',
    description,
    color: hex,
    isPartOf: { '@type': 'CreativeWorkSeries', name: '中国传统色 742 色', url: `${SITE}/dictionary.html` },
  };

  // JSON-LD is embedded as text; escape the closing tag sequence defensively.
  const jsonLd = [breadcrumbJsonLd, colorJsonLd]
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');

  const note = toneNote(hsl, temperature);

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#f7f7f4" data-theme-color>
    <title>${escapeHtml(`${name} ${hex} - 中国传统色色值与配色 | 中国传统配色`)}</title>
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="中国传统配色">
    <meta property="og:title" content="${escapeHtml(`${name} ${hex} - 中国传统色`)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(`${name} ${hex} - 中国传统色`)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImage)}">
    <link rel="icon" href="../favicon.svg?v=20260610-6" type="image/svg+xml">
    ${jsonLd}
    <script>
      (() => {
        try {
          const theme = localStorage.getItem('theme');
          if (theme === 'dark' || theme === 'light') {
            document.documentElement.dataset.theme = theme;
          }
        } catch (error) {
          document.documentElement.dataset.theme = 'light';
        }
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Noto+Serif+SC:wght@600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/styles.css?v=20260613-4">
    <link rel="stylesheet" href="../assets/css/color-page.css?v=${ASSET_VERSION}">
    <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js" defer></script>
  </head>
  <body data-current-page="dictionary" data-base="../">
    <a class="skip-link" href="#color-main">跳到颜色详情</a>

    <div data-shared-header></div>

    <main id="color-main" class="color-detail-page">
      <nav class="color-breadcrumb" aria-label="面包屑导航">
        <a href="../index.html">首页</a>
        <span aria-hidden="true">/</span>
        <a href="../dictionary.html">色彩字典</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtml(name)}</span>
      </nav>

      <header class="color-hero" style="--swatch: ${escapeHtml(hex)}; --swatch-ink: ${ink};">
        <div class="color-hero-swatch" aria-hidden="true">
          <span>${escapeHtml(name)}</span>
        </div>
        <div class="color-hero-copy">
          <p class="color-hero-id">No.${escapeHtml(image.id)} / 742</p>
          <h1>${escapeHtml(name)}</h1>
          <p class="color-hero-hex">${escapeHtml(hex)}</p>
          <div class="color-chips">${chipsMarkup}</div>
          <p class="color-hero-note">${escapeHtml(note)}</p>
        </div>
      </header>

      <section class="color-section" aria-labelledby="values-title">
        <h2 id="values-title">色值</h2>
        <p class="color-section-lede">点击任意色值即可复制。</p>
        <div class="color-values">${valuesMarkup}
        </div>
      </section>

      <section class="color-section" aria-labelledby="tools-title">
        <h2 id="tools-title">用这个颜色继续创作</h2>
        <div class="color-tools">
          <a class="button button-primary" href="../generator.html?colors=${encodeURIComponent(hex)}">配色生成</a>
          <a class="button button-secondary" href="../style-lab.html?color=${encodeURIComponent(image.id)}">场景试色</a>
          <a class="button button-secondary" href="../uses.html?q=${encodeURIComponent(name)}">用途卡片</a>
          <a class="button button-secondary" href="../${encodeURI(image.path)}" download>下载色卡 PNG</a>
          <a class="button button-secondary" href="cards/${escapeHtml(image.id)}.svg" download="${escapeHtml(`${name}-${hex}.svg`)}">下载分享卡</a>
        </div>
      </section>

      <section class="color-section" aria-labelledby="relations-title">
        <h2 id="relations-title">配色关系</h2>
        <p class="color-section-lede">以「${escapeHtml(name)}」为锚点，从 742 色库推导的配色方向。点击任意色卡查看它的详情。</p>
        <div class="relation-grid">${relationSections}
        </div>
      </section>
    </main>

    <div data-shared-footer></div>
    <div class="color-toast" data-toast role="status" aria-live="polite"></div>

    <script src="../assets/js/shared-chrome.js?v=20260614-4" defer></script>
    <script src="../assets/js/color-page.js?v=${ASSET_VERSION}" defer></script>
  </body>
</html>
`;
}

// A lightweight, on-brand SVG share card per color (downloadable / preview asset).
function renderShareCard(image, harmony) {
  const name = colorName(image);
  const hex = image.hex;
  const ink = readableText(hex);
  const sub = [harmony?.hueFamily, harmony?.temperature ? `${harmony.temperature}色` : '']
    .filter(Boolean)
    .join(' · ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(`${name} ${hex}`)}">
  <rect width="1200" height="630" fill="${escapeHtml(hex)}"/>
  <text x="80" y="120" font-family="'Noto Serif SC', serif" font-size="34" fill="${ink}" opacity="0.78">中国传统色 · No.${escapeHtml(image.id)}</text>
  <text x="80" y="360" font-family="'Noto Serif SC', serif" font-size="180" font-weight="900" fill="${ink}">${escapeHtml(name)}</text>
  <text x="80" y="470" font-family="'M PLUS Rounded 1c', sans-serif" font-size="64" fill="${ink}" letter-spacing="4">${escapeHtml(hex)}</text>
  <text x="80" y="545" font-family="'M PLUS Rounded 1c', sans-serif" font-size="34" fill="${ink}" opacity="0.7">${escapeHtml(sub)}</text>
  <text x="1120" y="560" text-anchor="end" font-family="'M PLUS Rounded 1c', sans-serif" font-size="30" fill="${ink}" opacity="0.6">colors.xiaoxiaodong.ai</text>
</svg>
`;
}

function renderSitemap(images) {
  const urls = [];
  for (const page of MAIN_PAGES) {
    urls.push({ loc: `${SITE}/${page.path}`, priority: page.priority, changefreq: page.changefreq });
  }
  for (const image of images) {
    urls.push({ loc: colorPageUrl(image), priority: '0.6', changefreq: 'monthly' });
  }
  const body = urls.map((url) => `  <url>
    <loc>${escapeHtml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function main() {
  const imagesWindow = loadBrowserData(await readFile(IMAGES_FILE, 'utf8'), IMAGES_FILE);
  const harmoniesWindow = loadBrowserData(await readFile(HARMONIES_FILE, 'utf8'), HARMONIES_FILE);
  const usageWindow = loadBrowserData(await readFile(USAGE_FILE, 'utf8'), USAGE_FILE);

  const images = imagesWindow.TRADITIONAL_COLOR_IMAGES || [];
  const harmonies = harmoniesWindow.TRADITIONAL_COLOR_HARMONIES || {};
  const usage = usageWindow.TRADITIONAL_COLOR_HARMONY_USAGE || {};

  if (!images.length) throw new Error('No images found in images.js');

  const imageById = new Map(images.map((image) => [image.id, image]));
  const context = { usage, imageById };

  // Rebuild the colors directory from scratch so renamed/removed colors never leave stragglers.
  await rm(COLORS_DIR, { recursive: true, force: true });
  await mkdir(CARDS_DIR, { recursive: true });

  let written = 0;
  for (const image of images) {
    const harmony = harmonies[image.id];
    const slug = colorSlug(image);
    await writeFile(path.join(COLORS_DIR, `${slug}.html`), renderColorPage(image, harmony, context), 'utf8');
    await writeFile(path.join(CARDS_DIR, `${image.id}.svg`), renderShareCard(image, harmony), 'utf8');
    written += 1;
  }

  await writeFile(SITEMAP_FILE, renderSitemap(images), 'utf8');

  console.log(`Generated ${written} color pages + share cards under colors/`);
  console.log(`Wrote sitemap.xml with ${MAIN_PAGES.length + images.length} URLs`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
