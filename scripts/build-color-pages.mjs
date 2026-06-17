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
const ASSET_VERSION = '20260616-1';
const SHARED_STYLE_VERSION = '20260616-1';
const SHARED_CHROME_VERSION = '20260616-1';

// Sitemap <lastmod> date. Bumped by hand (like ASSET_VERSION) when color data or
// pages change — kept as a constant, NOT new Date(), so the generated artifacts
// stay a deterministic function of their inputs. The verify workflow rebuilds and
// diffs every artifact; a build-time clock would drift each day and fail CI.
const LASTMOD = '2026-06-17';

// Hue families grouped on the static colors/index.html, ordered to match the
// dictionary hue filter (红 → 中性). Any family not listed falls to the end.
const HUE_FAMILY_ORDER = ['红色系', '橙色系', '黄色系', '绿色系', '青色系', '蓝色系', '紫色系', '中性色'];

// Shared entity nodes for structured data — consolidates the site, author and
// term set so Google/LLMs can resolve one brand entity. sameAs links the
// 1k-star GitHub repo and the author's X profile.
const REPO_URL = 'https://github.com/nevertoday/zhongguo-traditional-colors';
const AUTHOR_NODE = {
  '@type': 'Person',
  name: '小小东',
  url: `${SITE}/`,
  sameAs: ['https://x.com/xiaoxiaodong01', REPO_URL],
};
const TERM_SET_NODE = {
  '@type': 'DefinedTermSet',
  '@id': `${SITE}/dictionary.html#termset`,
  name: '中国传统色 742 色',
  url: `${SITE}/dictionary.html`,
};

// Root-level pages that also belong in the sitemap, with crawl priority hints.
const MAIN_PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'explorer.html', priority: '0.9', changefreq: 'weekly' },
  { path: 'dictionary.html', priority: '0.9', changefreq: 'weekly' },
  { path: 'palettes.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'generator.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'theme-forge.html', priority: '0.8', changefreq: 'weekly' },
  { path: 'terminal.html', priority: '0.8', changefreq: 'weekly' },
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

// WCAG relative luminance of an {r,g,b} (0–1).
function relativeLuminance({ r, g, b }) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

// WCAG contrast ratio between two hex colors (1–21), or null if unparseable.
function contrastRatio(hexA, hexB) {
  const a = rgbFromHex(hexA);
  const b = rgbFromHex(hexB);
  if (!a || !b) return null;
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
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

function renderColorPage(image, harmony, context, siblings = {}) {
  const { usage, imageById } = context;
  const { prev, next } = siblings;
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
  const cmyk = image.cmyk || (rgb ? cmykFromRgb(rgb) : null);
  const thumbUrl = `${SITE}/thumbnails/color-card-${image.id}.jpg`;

  // Per-color uniqueness inputs (all data-derived, nothing fabricated): the
  // color's rank within its hue family, its first named harmony partners, and
  // the WCAG contrast of readable text over the swatch. These make every page's
  // prose differ by family, position, partner names and contrast numbers.
  const rank = context.familyRank?.get(image.id);
  const firstOf = (key) => {
    const ids = Array.isArray(harmony?.[key]) ? harmony[key] : [];
    for (const id of ids) {
      const found = imageById.get(id);
      if (found) return found;
    }
    return null;
  };
  const comp = firstOf('complementary');
  const ana = firstOf('analogous');
  const textWhite = contrastRatio(hex, '#ffffff');
  const textBlack = contrastRatio(hex, '#1a1a1a');
  const useWhiteText = (textWhite ?? 0) >= (textBlack ?? 0);
  const bestContrast = useWhiteText ? textWhite : textBlack;
  const aaLabel = !bestContrast ? '' : bestContrast >= 4.5 ? '达到' : bestContrast >= 3 ? '接近' : '低于';

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
    + `${comp ? `互补色可搭配「${colorName(comp)} ${comp.hex}」，` : ''}`
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

  const additionalProperty = [
    { '@type': 'PropertyValue', name: 'HEX', value: hex },
    rgb && { '@type': 'PropertyValue', name: 'RGB', value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    hsl && { '@type': 'PropertyValue', name: 'HSL', value: `${hsl.h}, ${hsl.s}%, ${hsl.l}%` },
    cmyk && { '@type': 'PropertyValue', name: 'CMYK', value: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%` },
    hueFamily && { '@type': 'PropertyValue', name: '色系', value: hueFamily },
    temperature && { '@type': 'PropertyValue', name: '冷暖', value: `${temperature}色` },
  ].filter(Boolean);

  const colorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${name}`,
    alternateName: hex,
    url: canonical,
    image: {
      '@type': 'ImageObject',
      contentUrl: ogImage,
      thumbnailUrl: thumbUrl,
      caption: `中国传统色 ${name} ${hex} 色卡`,
    },
    inLanguage: 'zh-CN',
    description,
    color: hex,
    creator: AUTHOR_NODE,
    isPartOf: { '@type': 'CreativeWorkSeries', name: '中国传统色 742 色', url: `${SITE}/dictionary.html` },
    additionalProperty,
  };

  // Each color is also a DefinedTerm in the 742-color set — the purpose-built
  // schema for a 色彩字典, and a strong entity signal for AI/LLM citation.
  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    termCode: hex,
    url: canonical,
    inLanguage: 'zh-CN',
    inDefinedTermSet: TERM_SET_NODE,
  };

  // JSON-LD is embedded as text; escape the closing tag sequence defensively.
  const jsonLd = [breadcrumbJsonLd, colorJsonLd, definedTermJsonLd]
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');

  const note = toneNote(hsl, temperature);

  // Data-derived "关于" paragraph — unique per color because it weaves in the
  // family rank, named harmony partners and contrast ratio (no fabrication).
  const aboutSentences = [
    `「${name}」是中国传统色之一${hueFamily ? `，属${hueFamily}` : ''}${temperature ? `、${temperature}调` : ''}，`
      + `色值 HEX ${hex}${rgb ? `、RGB ${rgb.r},${rgb.g},${rgb.b}` : ''}${hsl ? `、HSL ${hsl.h},${hsl.s}%,${hsl.l}%` : ''}${cmyk ? `、CMYK ${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}` : ''}。`,
    rank && hueFamily ? `在${hueFamily}的 ${rank.total} 种传统色中，它按色序排第 ${rank.index} 位。` : '',
    (comp || ana)
      ? `配色上，其互补方向可取「${comp ? `${colorName(comp)} ${comp.hex}` : ''}」${ana ? `，邻近色可取「${colorName(ana)} ${ana.hex}」` : ''}。`
      : '',
    bestContrast ? `作为底色时，搭配${useWhiteText ? '白' : '深'}色文字对比度约 ${bestContrast.toFixed(1)}∶1，${aaLabel} WCAG AA 正文标准（4.5∶1）。` : '',
  ].filter(Boolean).join('');

  const aboutSection = `
      <section class="color-section" aria-labelledby="about-title">
        <h2 id="about-title">关于「${escapeHtml(name)}」</h2>
        <p class="color-section-lede">${escapeHtml(aboutSentences)}</p>
        <figure class="color-card-figure" style="margin:1.25rem 0 0; max-width:270px;">
          <img src="../thumbnails/color-card-${escapeHtml(image.id)}.jpg" width="270" height="360" loading="lazy" decoding="async" alt="${escapeHtml(`中国传统色 ${name} ${hex} 色卡`)}" style="display:block; width:100%; height:auto;">
          <figcaption class="color-section-lede" style="margin-top:0.5rem;">「${escapeHtml(name)}」色卡 · ${escapeHtml(hex)}</figcaption>
        </figure>
      </section>`;

  // Static prev/next + all-colors links. These keep every page reachable by
  // sequential traversal (id order) and give one hop to the full index, so the
  // crawl graph is fully connected without relying on JavaScript.
  const prevLink = prev
    ? `<a class="button button-secondary" rel="prev" href="${encodeURIComponent(colorSlug(prev))}.html">← ${escapeHtml(colorName(prev))}</a>`
    : '<span></span>';
  const nextLink = next
    ? `<a class="button button-secondary" rel="next" href="${encodeURIComponent(colorSlug(next))}.html">${escapeHtml(colorName(next))} →</a>`
    : '<span></span>';
  const pager = `
      <nav class="color-pager" aria-label="颜色翻页" style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; justify-content:space-between; margin-top:2.5rem;">
        ${prevLink}
        <a class="button button-primary" href="index.html">全部 742 色索引</a>
        ${nextLink}
      </nav>`;

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
    <link rel="stylesheet" href="../assets/css/styles.css?v=${SHARED_STYLE_VERSION}">
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
${aboutSection}

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
      ${pager}
    </main>

    <div data-shared-footer></div>
    <div class="color-toast" data-toast role="status" aria-live="polite"></div>

    <script src="../assets/js/shared-chrome.js?v=${SHARED_CHROME_VERSION}" defer></script>
    <script src="../assets/js/color-page.js?v=${ASSET_VERSION}" defer></script>
  </body>
</html>
`;
}

// Resolve a color's recommended companions (辅色 + 点缀色) to {name, hex} pairs,
// snapped to real library entries — the "配色搭档" row on the share card.
function resolvePartners(harmony, imageById) {
  if (!harmony) return [];
  const ids = [...(harmony.secondary || []).slice(0, 2), ...(harmony.accent || []).slice(0, 2)];
  const seen = new Set();
  const partners = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const companion = imageById.get(id);
    if (companion?.hex) partners.push({ name: colorName(companion), hex: companion.hex });
  }
  return partners.slice(0, 4);
}

// A downloadable "传统色身份证" share card (1200×630, also the og:image): name,
// id, hue family, hex/rgb/cmyk and the color's real harmony companions — every
// value sourced from the data layer, nothing invented.
function renderShareCard(image, harmony, partners = []) {
  const name = colorName(image);
  const hex = image.hex;
  const ink = readableText(hex);
  const rgb = rgbFromHex(hex) || { r: 0, g: 0, b: 0 };
  const cmyk = image.cmyk || cmykFromRgb(rgb);
  const heading = ['中国传统色', `No.${image.id}`, harmony?.hueFamily, harmony?.temperature ? `${harmony.temperature}色` : '']
    .filter(Boolean)
    .join(' · ');
  const nameSize = name.length >= 6 ? 96 : name.length >= 5 ? 120 : 150;
  const pinyinLine = image.pinyin
    ? `\n  <text x="80" y="340" font-family="'M PLUS Rounded 1c', sans-serif" font-size="30" fill="${ink}" opacity="0.72" letter-spacing="1">${escapeHtml(image.pinyin)}</text>`
    : '';
  const partnerTitle = partners.length
    ? `\n  <text x="80" y="512" font-family="'M PLUS Rounded 1c', sans-serif" font-size="22" fill="${ink}" opacity="0.6">配色搭档 · 取自传统色库</text>`
    : '';
  const chips = partners.map((partner, index) => {
    const x = 80 + index * 265;
    return `  <rect x="${x}" y="540" width="34" height="34" fill="${escapeHtml(partner.hex)}" stroke="${ink}" stroke-opacity="0.4"/>
  <text x="${x + 46}" y="565" font-family="'Noto Serif SC', serif" font-size="24" fill="${ink}" opacity="0.82">${escapeHtml(partner.name)}</text>`;
  }).join('\n');
  const chipBlock = chips ? `\n${chips}` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(`${name} ${hex}`)}">
  <rect width="1200" height="630" fill="${escapeHtml(hex)}"/>
  <text x="80" y="96" font-family="'Noto Serif SC', serif" font-size="30" fill="${ink}" opacity="0.78">${escapeHtml(heading)}</text>
  <text x="80" y="288" font-family="'Noto Serif SC', serif" font-size="${nameSize}" font-weight="900" fill="${ink}">${escapeHtml(name)}</text>${pinyinLine}
  <text x="80" y="404" font-family="'M PLUS Rounded 1c', sans-serif" font-size="56" fill="${ink}" letter-spacing="4">${escapeHtml(hex)}</text>
  <text x="80" y="458" font-family="'M PLUS Rounded 1c', sans-serif" font-size="30" fill="${ink}" opacity="0.72">RGB ${rgb.r} ${rgb.g} ${rgb.b}　CMYK ${cmyk.c} ${cmyk.m} ${cmyk.y} ${cmyk.k}</text>${partnerTitle}${chipBlock}
  <text x="1120" y="600" text-anchor="end" font-family="'M PLUS Rounded 1c', sans-serif" font-size="28" fill="${ink}" opacity="0.55">colors.xiaoxiaodong.ai</text>
</svg>
`;
}

// The static all-colors index page (colors/index.html). This is the crawl-path
// fix: every one of the 742 color pages is reachable from here via a real
// <a href> in the static HTML — no JavaScript required — grouped by hue family.
function renderColorIndex(images, harmonies) {
  const canonical = `${SITE}/colors/`;
  const ogImage = `${SITE}/docs/screenshots/home-gallery.png`;
  const description = `中国传统色大全：${images.length} 种中华传统色色卡一览，按红橙黄绿青蓝紫与中性色系分组，每色含 HEX/RGB 色值并链接到独立色彩详情页。由小小东整理维护，MIT 开源。`;
  const intro = `这里收录 ${images.length} 种中国传统色（中华传统色），按色系分组排列，是一份可检索的传统色色卡大全。每个颜色都有独立页面，列出 HEX、RGB、HSL、CMYK 色值与同类、邻近、互补等配色关系。色值来自项目维护的 742 色清单，由小小东整理、MIT 开源。`;

  // Bucket colors by hue family, preserving the manifest's id order within each.
  const groups = new Map(HUE_FAMILY_ORDER.map((family) => [family, []]));
  for (const image of images) {
    const family = harmonies[image.id]?.hueFamily || '其他';
    if (!groups.has(family)) groups.set(family, []);
    groups.get(family).push(image);
  }

  const sections = [...groups.entries()]
    .filter(([, list]) => list.length)
    .map(([family, list]) => {
      const swatches = list.map((image) => {
        const href = `${encodeURIComponent(colorSlug(image))}.html`;
        const name = colorName(image);
        return `
              <a class="relation-swatch" href="${href}" style="--swatch: ${escapeHtml(image.hex)}; --swatch-ink: ${readableText(image.hex)};">
                <span class="relation-swatch-name">${escapeHtml(name)}</span>
                <span class="relation-swatch-hex">${escapeHtml(image.hex)}</span>
              </a>`;
      }).join('');
      return `
          <section class="relation-block">
            <h2>${escapeHtml(family)}<span class="relation-intent">（${list.length} 色）</span></h2>
            <div class="relation-swatches">${swatches}</div>
          </section>`;
    }).join('');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '色彩字典', item: `${SITE}/dictionary.html` },
      { '@type': 'ListItem', position: 3, name: '全部色卡索引', item: canonical },
    ],
  };
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '中国传统色大全',
    url: canonical,
    inLanguage: 'zh-CN',
    description,
    isPartOf: { '@type': 'WebSite', name: '中国传统配色', url: `${SITE}/` },
    about: TERM_SET_NODE,
    author: AUTHOR_NODE,
    numberOfItems: images.length,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: images.length,
      itemListElement: images.map((image, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: colorPageUrl(image),
        name: `${colorName(image)} ${image.hex}`,
      })),
    },
  };
  const jsonLd = [breadcrumbJsonLd, collectionJsonLd]
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#f7f7f4" data-theme-color>
    <title>中国传统色大全 · 全部 ${images.length} 色色卡 | 中国传统配色</title>
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="中国传统配色">
    <meta property="og:title" content="中国传统色大全 · 全部 ${images.length} 色">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="中国传统色大全 · 全部 ${images.length} 色">
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
    <link rel="stylesheet" href="../assets/css/styles.css?v=${SHARED_STYLE_VERSION}">
    <link rel="stylesheet" href="../assets/css/color-page.css?v=${ASSET_VERSION}">
    <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js" defer></script>
  </head>
  <body data-current-page="dictionary" data-base="../">
    <a class="skip-link" href="#color-index-main">跳到色卡索引</a>

    <div data-shared-header></div>

    <main id="color-index-main" class="color-detail-page">
      <nav class="color-breadcrumb" aria-label="面包屑导航">
        <a href="../index.html">首页</a>
        <span aria-hidden="true">/</span>
        <a href="../dictionary.html">色彩字典</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">全部色卡索引</span>
      </nav>

      <header class="color-hero" style="--swatch: #f7f7f4; --swatch-ink: #1a1a1a;">
        <div class="color-hero-copy">
          <p class="color-hero-id">中国传统色 · 全部 ${images.length} 色</p>
          <h1>中国传统色大全</h1>
          <p class="color-hero-note">${escapeHtml(intro)}</p>
        </div>
      </header>

      <section class="color-section" aria-labelledby="index-title">
        <h2 id="index-title" class="sr-only">按色系浏览全部色卡</h2>
        <div class="relation-grid">${sections}
        </div>
      </section>
    </main>

    <div data-shared-footer></div>

    <script src="../assets/js/shared-chrome.js?v=${SHARED_CHROME_VERSION}" defer></script>
  </body>
</html>
`;
}

// llms.txt + llms-full.txt — the canonical AI-discovery files for a reference
// dataset. llms.txt is a concise map; llms-full.txt inlines the whole color
// table so an LLM can answer "X 是什么颜色 / X 的 HEX" from a single fetch.
function renderLlmsTxt(images, harmonies) {
  const lead = `# 中国传统色（中华传统色）\n\n`
    + `> ${images.length} 种中国传统色色卡，每色含 HEX/RGB/HSL/CMYK 色值与同类、邻近、互补等配色关系。`
    + `由小小东整理维护，MIT 开源，源代码见 ${REPO_URL}。\n`;
  const keyPages = [
    `- [首页](${SITE}/)：项目主页与色卡画廊`,
    `- [中国传统色大全](${SITE}/colors/)：全部 ${images.length} 色，按色系分组的可检索索引`,
    `- [色彩字典](${SITE}/dictionary.html)：按色名 / 编号 / HEX 搜索`,
    `- [配色生成](${SITE}/generator.html) · [场景试色](${SITE}/style-lab.html) · [用途卡片](${SITE}/uses.html)`,
  ].join('\n');
  const short = `${lead}\n## 重点页面\n\n${keyPages}\n\n## 颜色明细\n\n`
    + `完整 ${images.length} 色「名称 — HEX — RGB — 色系」清单见 ${SITE}/llms-full.txt。\n`;

  const rows = images.map((image) => {
    const h = harmonies[image.id] || {};
    const rgb = rgbFromHex(image.hex);
    return `- ${colorName(image)} — ${image.hex}`
      + `${rgb ? ` — RGB ${rgb.r},${rgb.g},${rgb.b}` : ''}`
      + `${h.hueFamily ? ` — ${h.hueFamily}` : ''}${h.temperature ? `（${h.temperature}色）` : ''}`
      + ` — ${colorPageUrl(image)}`;
  }).join('\n');
  const full = `${lead}\n## 全部 ${images.length} 色（名称 — HEX — RGB — 色系 — 链接）\n\n${rows}\n`;
  return { short, full };
}

function renderSitemap(images) {
  const urls = [];
  for (const page of MAIN_PAGES) {
    urls.push({ loc: `${SITE}/${page.path}`, priority: page.priority, changefreq: page.changefreq });
  }
  // The static all-colors index — the crawlable hub that links to every color page.
  urls.push({ loc: `${SITE}/colors/`, priority: '0.9', changefreq: 'weekly' });
  for (const image of images) {
    // Each color page carries its color-card thumbnail as an <image:image> so the
    // 742 swatches become eligible for Google Images (a natural channel for a
    // color-card site that the og:image meta alone does not unlock).
    urls.push({
      loc: colorPageUrl(image),
      priority: '0.6',
      changefreq: 'monthly',
      image: {
        loc: `${SITE}/thumbnails/color-card-${image.id}.jpg`,
        title: `中国传统色 ${colorName(image)} ${image.hex} 色卡`,
      },
    });
  }
  const body = urls.map((url) => `  <url>
    <loc>${escapeHtml(url.loc)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.image ? `
    <image:image>
      <image:loc>${escapeHtml(url.image.loc)}</image:loc>
      <image:title>${escapeHtml(url.image.title)}</image:title>
    </image:image>` : ''}
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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

  // Per-color rank within its hue family (id order) — feeds the unique "关于"
  // prose on each color page so two colors in the same family read differently.
  const familyRank = new Map();
  const familyGroups = new Map();
  for (const image of images) {
    const family = harmonies[image.id]?.hueFamily || '其他';
    if (!familyGroups.has(family)) familyGroups.set(family, []);
    familyGroups.get(family).push(image);
  }
  for (const list of familyGroups.values()) {
    list.forEach((image, i) => familyRank.set(image.id, { index: i + 1, total: list.length }));
  }

  const context = { usage, imageById, familyRank };

  // Rebuild the colors directory from scratch so renamed/removed colors never leave stragglers.
  await rm(COLORS_DIR, { recursive: true, force: true });
  await mkdir(CARDS_DIR, { recursive: true });

  let written = 0;
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    const harmony = harmonies[image.id];
    const slug = colorSlug(image);
    const siblings = { prev: images[i - 1], next: images[i + 1] };
    await writeFile(path.join(COLORS_DIR, `${slug}.html`), renderColorPage(image, harmony, context, siblings), 'utf8');
    const partners = resolvePartners(harmony, imageById);
    await writeFile(path.join(CARDS_DIR, `${image.id}.svg`), renderShareCard(image, harmony, partners), 'utf8');
    written += 1;
  }

  // The static all-colors index lives at colors/index.html (served as /colors/).
  await writeFile(path.join(COLORS_DIR, 'index.html'), renderColorIndex(images, harmonies), 'utf8');

  await writeFile(SITEMAP_FILE, renderSitemap(images), 'utf8');

  // AI-discovery files at the site root.
  const llms = renderLlmsTxt(images, harmonies);
  await writeFile(path.join(ROOT, 'llms.txt'), llms.short, 'utf8');
  await writeFile(path.join(ROOT, 'llms-full.txt'), llms.full, 'utf8');

  console.log(`Generated ${written} color pages + share cards under colors/`);
  console.log('Wrote colors/index.html (static all-colors index)');
  console.log('Wrote llms.txt + llms-full.txt');
  console.log(`Wrote sitemap.xml with ${MAIN_PAGES.length + 1 + images.length} URLs`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
