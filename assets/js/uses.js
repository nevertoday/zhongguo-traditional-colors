const images = window.TRADITIONAL_COLOR_IMAGES || [];
const harmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
const imagesById = new Map(images.map((image) => [image.id, image]));

const themeToggle = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('[data-theme-icon]');
const themeLabel = document.querySelector('[data-theme-label]');
const themeColorMeta = document.querySelector('[data-theme-color]');
const siteHeader = document.querySelector('.site-header');
const siteNav = document.querySelector('#site-nav');
const navToggle = document.querySelector('[data-nav-toggle]');
const footerColorButtons = document.querySelectorAll('[data-footer-color]');
const footerCopyStatus = document.querySelector('[data-footer-copy-status]');
const searchInput = document.querySelector('[data-use-search]');
const modebar = document.querySelector('[data-use-modebar]');
const huebar = document.querySelector('[data-use-huebar]');
const biasInput = document.querySelector('[data-use-bias]');
const shuffleButton = document.querySelector('[data-use-shuffle]');
const grid = document.querySelector('[data-use-grid]');
const resultCount = document.querySelector('[data-use-count]');
const loadMoreButton = document.querySelector('[data-use-load-more]');
const toast = document.querySelector('[data-toast]');
const debounce = window.ZH_UTILS?.debounce || ((fn, delay) => {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
});

const STEP = 32;
const CONNECTOR_PATTERN = /\s*(?:&|\+|with|and|on|配|和)\s*/i;
const MODES = [
  { key: 'type', label: '文字', icon: 'lucide:type' },
  { key: 'split', label: '分栏', icon: 'lucide:columns-2' },
  { key: 'scale', label: '阶梯', icon: 'lucide:bar-chart-3' },
  { key: 'image', label: '图像', icon: 'lucide:image' },
  { key: 'palette', label: '色板', icon: 'lucide:rows-3' },
];
const HUE_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'red', label: '红' },
  { key: 'orange', label: '橙' },
  { key: 'yellow', label: '黄' },
  { key: 'green', label: '绿' },
  { key: 'cyan', label: '青' },
  { key: 'blue', label: '蓝' },
  { key: 'purple', label: '紫' },
  { key: 'neutral', label: '灰' },
];
const TYPE_TESTS = {
  all: () => true,
  warm: (color) => color.temperature === '暖',
  cold: (color) => color.temperature === '冷',
  cool: (color) => color.temperature === '冷',
  light: (color) => color.hsl.l >= 72,
  dark: (color) => color.hsl.l <= 38,
  pastel: (color) => color.hsl.s <= 50 && color.hsl.l >= 66,
  pale: (color) => color.hsl.s <= 42 && color.hsl.l >= 72,
  deep: (color) => color.hsl.l <= 34 && color.hsl.s >= 24,
  muted: (color) => color.hsl.s <= 34,
  rich: (color) => color.hsl.s >= 52 && color.hsl.l <= 62,
  bright: (color) => color.hsl.s >= 62 && color.hsl.l >= 46,
  neon: (color) => color.hsl.s >= 80 && color.hsl.l >= 48,
  red: (color) => color.hue === 'red',
  orange: (color) => color.hue === 'orange',
  yellow: (color) => color.hue === 'yellow',
  green: (color) => color.hue === 'green',
  cyan: (color) => color.hue === 'cyan',
  blue: (color) => color.hue === 'blue',
  violet: (color) => color.hue === 'purple',
  purple: (color) => color.hue === 'purple',
  magenta: (color) => color.hue === 'purple' || color.hue === 'red',
  neutral: (color) => color.hue === 'neutral',
  暖色: (color) => color.temperature === '暖',
  冷色: (color) => color.temperature === '冷',
  浅色: (color) => color.hsl.l >= 72,
  深色: (color) => color.hsl.l <= 38,
  红: (color) => color.hue === 'red',
  橙: (color) => color.hue === 'orange',
  黄: (color) => color.hue === 'yellow',
  绿: (color) => color.hue === 'green',
  青: (color) => color.hue === 'cyan',
  蓝: (color) => color.hue === 'blue',
  紫: (color) => color.hue === 'purple',
  灰: (color) => color.hue === 'neutral',
};

let visibleCount = STEP;
let selectedId = '';
let currentMode = 'type';
let currentHue = 'all';
let randomRanks = new Map();
let toastTimer;
let footerCopyTimer;
let navResizeFrame;
let autoObserver;
let colorPoolCache;
let cardCacheKey = '';
let cardCache = [];
let randomVersion = 0;

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
  return image?.file?.replace(/\.[^.]+$/, '').replace(/^\d{3}-/, '') || '';
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
    saturation = delta / (1 - Math.abs((2 * lightness) - 1));
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

function hueFromHsl(hsl) {
  if (hsl.s < 12) return 'neutral';
  if (hsl.h < 15 || hsl.h >= 345) return 'red';
  if (hsl.h < 45) return 'orange';
  if (hsl.h < 75) return 'yellow';
  if (hsl.h < 155) return 'green';
  if (hsl.h < 195) return 'cyan';
  if (hsl.h < 255) return 'blue';
  if (hsl.h < 315) return 'purple';
  return 'red';
}

function luminanceChannel(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const rgb = rgbFromHex(hex);
  if (!rgb) return 0;
  return (0.2126 * luminanceChannel(rgb.r)) + (0.7152 * luminanceChannel(rgb.g)) + (0.0722 * luminanceChannel(rgb.b));
}

function contrastRatio(firstHex, secondHex) {
  const first = relativeLuminance(firstHex);
  const second = relativeLuminance(secondHex);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function colorFromImage(image) {
  const harmony = harmonies[image.id] || {};
  const hsl = harmony.hsl || hslFromRgb(rgbFromHex(image.hex));
  return {
    id: image.id,
    name: colorName(image),
    hex: image.hex,
    hsl,
    hue: hueFromHsl(hsl),
    temperature: harmony.temperature || '',
    luminance: relativeLuminance(image.hex),
    searchText: `${image.id} ${colorName(image)} ${image.hex}`.toLowerCase(),
  };
}

function colorFromId(id) {
  const image = imagesById.get(id);
  return image?.hex ? colorFromImage(image) : null;
}

function colorPool() {
  if (!colorPoolCache) {
    colorPoolCache = images.filter((image) => image.hex).map(colorFromImage);
  }
  return colorPoolCache;
}

function tokens(value) {
  return value.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function colorMatches(color, query) {
  const value = query.trim().toLowerCase();
  if (!value || value === 'all' || value === '全部') return true;
  return tokens(value).every((token) => {
    const test = TYPE_TESTS[token];
    if (test) return test(color);
    return window.ZH_COLOR_SEARCH?.matchesText?.(color.searchText, token) || color.searchText.includes(token);
  });
}

function parsedSearch() {
  const value = searchInput?.value.trim() || '';
  const parts = value.split(CONNECTOR_PATTERN).map((part) => part.trim()).filter(Boolean);
  return {
    raw: value,
    first: parts[0] || '',
    second: parts[1] || '',
  };
}

function partnerIds(color) {
  const harmony = harmonies[color.id] || {};
  return [
    ...(harmony.complementary || []),
    ...(harmony.splitComplementary || []),
    ...(harmony.analogous || []),
    ...(harmony.secondary || []),
    ...(harmony.accent || []),
    ...(harmony.neutral || []),
  ];
}

function uniqueColors(colors) {
  const seen = new Set();
  return colors.filter((color) => {
    if (!color?.id || seen.has(color.id)) return false;
    seen.add(color.id);
    return true;
  });
}

function pairCandidates(color, secondQuery) {
  const source = uniqueColors(partnerIds(color).map(colorFromId).filter(Boolean));
  const pool = source.length ? source : colorPool();
  const filtered = secondQuery ? pool.filter((item) => colorMatches(item, secondQuery)) : pool;
  const fallback = secondQuery && !filtered.length
    ? colorPool().filter((item) => colorMatches(item, secondQuery))
    : filtered;
  return uniqueColors(fallback).filter((item) => item.id !== color.id);
}

function biasScore(background, text) {
  const bias = Number.parseInt(biasInput?.value || '50', 10);
  const contrast = Math.min(contrastRatioFromColors(background, text), 12) * 20;
  const backgroundBias = 100 - Math.abs(background.hsl.l - (bias > 50 ? 78 : 28));
  const textBias = 100 - Math.abs(text.hsl.l - (bias > 50 ? 24 : 82));
  return contrast + backgroundBias + textBias;
}

function cardId(background, text) {
  return `${background.id}-${text.id}`;
}

function contrastRatioFromColors(first, second) {
  const lighter = Math.max(first.luminance, second.luminance);
  const darker = Math.min(first.luminance, second.luminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function cardsCacheKey(search) {
  return [
    search.raw,
    search.first,
    search.second,
    currentHue,
    biasInput?.value || '50',
    randomVersion,
  ].join('::');
}

function allCards() {
  const search = parsedSearch();
  const cacheKey = cardsCacheKey(search);
  if (cacheKey === cardCacheKey) return cardCache;

  const backgrounds = colorPool()
    .filter((background) => currentHue === 'all' || background.hue === currentHue)
    .filter((background) => colorMatches(background, search.first));
  const texts = colorPool()
    .filter((text) => colorMatches(text, search.second));

  cardCache = backgrounds
    .flatMap((background) => texts
      .filter((text) => text.id !== background.id)
      .map((text) => ({
        id: cardId(background, text),
        background,
        text,
        ratio: contrastRatioFromColors(background, text),
        score: biasScore(background, text),
      })))
    .filter((card) => card.ratio >= 2.2)
    .sort((first, second) => (
      (second.score - ((randomRanks.get(second.id) ?? 0) * 24))
      - (first.score - ((randomRanks.get(first.id) ?? 0) * 24))
    ));
  cardCacheKey = cacheKey;
  return cardCache;
}

function shuffleOrder() {
  const pool = colorPool();
  randomRanks = new Map();
  pool.forEach((background) => {
    pool.forEach((text) => {
      if (background.id !== text.id) randomRanks.set(cardId(background, text), Math.random());
    });
  });
  randomVersion += 1;
  cardCacheKey = '';
}

function cardMarkup(card, index) {
  const contrastLabel = card.ratio >= 4.5 ? '清晰' : '谨慎';
  const modeBody = modeMarkup(card);
  const favoriteActive = window.ZH_FAVORITES?.has(`use:${card.id}`);
  return `
    <article class="use-pair-card use-pair-card--${escapeHtml(currentMode)}" tabindex="0" data-use-card="${escapeHtml(card.id)}" aria-selected="${card.id === selectedId ? 'true' : 'false'}" style="--pair-bg: ${escapeHtml(card.background.hex)}; --pair-text: ${escapeHtml(card.text.hex)};">
      <button class="use-favorite-button" type="button" data-use-favorite="${escapeHtml(card.id)}" aria-pressed="${favoriteActive ? 'true' : 'false'}" aria-label="${favoriteActive ? '取消收藏' : '收藏'} ${escapeHtml(card.background.name)} 和 ${escapeHtml(card.text.name)}" title="${favoriteActive ? '取消收藏' : '收藏'}">
        <iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon>
        <span class="sr-only">${favoriteActive ? '已收藏' : '收藏'}</span>
      </button>
      <div class="use-pair-actions">
        <button type="button" data-use-copy-card="${escapeHtml(card.id)}" aria-label="复制 ${escapeHtml(card.background.name)} 和 ${escapeHtml(card.text.name)} 整组配色">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          复制方案
        </button>
        <button type="button" data-use-remix="${escapeHtml(card.background.id)}" aria-label="以 ${escapeHtml(card.background.name)} 重新生成配色">
          <iconify-icon icon="lucide:shuffle" aria-hidden="true"></iconify-icon>
          换相近
        </button>
      </div>
      ${modeBody}
      <footer class="use-pair-meta">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(card.background.hex)} / ${escapeHtml(card.text.hex)}</strong>
        <em>${contrastLabel} ${card.ratio.toFixed(1)}:1</em>
      </footer>
    </article>
  `;
}

function modeMarkup(card) {
  if (currentMode === 'split') {
    return `
      <div class="use-pair-split">
        <section>
          <span>Background</span>
          <h3>${escapeHtml(card.background.name)}</h3>
          <small>${escapeHtml(card.background.hex)}</small>
        </section>
        <section>
          <span>Text</span>
          <h3>${escapeHtml(card.text.name)}</h3>
          <small>${escapeHtml(card.text.hex)}</small>
        </section>
      </div>
    `;
  }

  if (currentMode === 'scale') {
    return `
      <div class="use-pair-scale" aria-hidden="true">
        <span style="--step: 10%"></span>
        <span style="--step: 26%"></span>
        <span style="--step: 42%"></span>
        <span style="--step: 58%"></span>
        <span style="--step: 74%"></span>
        <span style="--step: 90%"></span>
      </div>
      <div class="use-pair-caption">
        <h3>${escapeHtml(card.background.name)} / ${escapeHtml(card.text.name)}</h3>
        <p>用阶梯看明度过渡和信息层级。</p>
      </div>
    `;
  }

  if (currentMode === 'image') {
    return `
      <div class="use-pair-image" aria-hidden="true">
        <i></i>
        <b></b>
        <span></span>
      </div>
      <div class="use-pair-caption">
        <h3>${escapeHtml(card.background.name)}</h3>
        <p>${escapeHtml(card.text.name)} 作为图像上的文字色。</p>
      </div>
    `;
  }

  if (currentMode === 'palette') {
    return `
      <div class="use-pair-palette" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="use-pair-caption">
        <h3>${escapeHtml(card.background.name)} & ${escapeHtml(card.text.name)}</h3>
        <p>用色板条先看面积比例。</p>
      </div>
    `;
  }

  return `
    <div class="use-pair-type">
      <h3>${escapeHtml(card.background.name)}</h3>
      <h4>& ${escapeHtml(card.text.name)} —</h4>
      <p>${escapeHtml(card.background.name)}作背景，${escapeHtml(card.text.name)}作文字；这组中国色适合先看标题、正文和卡片信息。</p>
    </div>
  `;
}

function findCard(id) {
  return allCards().find((card) => card.id === id) || allCards()[0] || null;
}

function renderGrid() {
  if (!grid) return;
  const cards = allCards();
  const visible = cards.slice(0, visibleCount);
  if (!selectedId || !cards.some((card) => card.id === selectedId)) {
    selectedId = visible[0]?.id || '';
  }

  grid.innerHTML = visible.length
    ? visible.map(cardMarkup).join('')
    : '<div class="empty-state"><strong>没有找到卡片</strong><span>试试“月白”“冷色”“深色 & 黄”或 HEX。</span></div>';

  if (resultCount) {
    const mode = MODES.find((item) => item.key === currentMode);
    resultCount.textContent = `已显示 ${visible.length.toLocaleString('zh-CN')} / ${cards.length.toLocaleString('zh-CN')} 张${mode?.label || '文字'}卡片`;
  }
  if (loadMoreButton) {
    const autoLoadSupported = 'IntersectionObserver' in window;
    loadMoreButton.hidden = autoLoadSupported || visible.length >= cards.length;
  }
  setupAutoLoad();
}

function setupAutoLoad() {
  if (!grid || !loadMoreButton || !('IntersectionObserver' in window)) return;
  const trigger = loadMoreButton.closest('.palette-more') || loadMoreButton;
  autoObserver?.disconnect();
  autoObserver = new IntersectionObserver((entries) => {
    const cards = allCards();
    const shouldLoad = entries.some((entry) => entry.isIntersecting) && visibleCount < cards.length;
    if (shouldLoad) appendCards(STEP);
  }, { rootMargin: '520px 0px' });
  autoObserver.observe(trigger);
}

function appendCards(count) {
  const cards = allCards();
  const currentVisible = Math.min(visibleCount, cards.length);
  const nextVisible = Math.min(currentVisible + count, cards.length);
  if (nextVisible <= currentVisible) return;
  visibleCount = nextVisible;
  renderGrid();
}

function renderModebar() {
  if (!modebar) return;
  modebar.innerHTML = MODES.map((mode) => `
    <button type="button" data-use-mode="${escapeHtml(mode.key)}" aria-pressed="${mode.key === currentMode ? 'true' : 'false'}" title="${escapeHtml(mode.label)}">
      <iconify-icon icon="${escapeHtml(mode.icon)}" aria-hidden="true"></iconify-icon>
      <span class="sr-only">${escapeHtml(mode.label)}</span>
    </button>
  `).join('');
}

function renderHuebar() {
  if (!huebar) return;
  huebar.innerHTML = HUE_FILTERS.map((filter) => `
    <button type="button" data-use-hue="${escapeHtml(filter.key)}" aria-pressed="${filter.key === currentHue ? 'true' : 'false'}">${escapeHtml(filter.label)}</button>
  `).join('');
}

function rerender(resetVisible = true) {
  if (resetVisible) visibleCount = STEP;
  renderModebar();
  renderHuebar();
  renderGrid();
}

function cardText(card) {
  return [
    `中国传统色用途卡片：${card.background.name} & ${card.text.name}`,
    `背景：${card.background.name} ${card.background.hex}`,
    `文字：${card.text.name} ${card.text.hex}`,
    `对比：${card.ratio.toFixed(1)}:1`,
    `建议：${card.background.name}作背景，${card.text.name}作标题、正文或按钮文字。`,
  ].join('\n');
}

function useFavoriteItem(card) {
  return {
    id: `use:${card.id}`,
    type: 'use',
    title: `${card.background.name} & ${card.text.name}`,
    subtitle: `${card.background.hex} 背景 / ${card.text.hex} 文字 · 对比 ${card.ratio.toFixed(1)}:1`,
    colors: [card.background, card.text],
    href: `uses.html?pair=${encodeURIComponent(card.id)}`,
    text: cardText(card),
  };
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
}

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = 'true';
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = 'false';
  }, 1600);
}

async function copyColor(id) {
  const color = colorFromId(id);
  if (!color) return;
  await writeClipboard(`${color.name} ${color.hex}`);
  showToast(`已复制：${color.name} ${color.hex}`);
}

async function copyCard(id = selectedId, renderAfterCopy = true) {
  const card = findCard(id);
  if (!card) return;
  selectedId = card.id;
  await writeClipboard(cardText(card));
  showToast(`已复制：${card.background.name} & ${card.text.name}`);
  if (renderAfterCopy) renderGrid();
}

function remixFromColor(id) {
  const color = colorFromId(id);
  if (!color) return;
  if (searchInput) searchInput.value = color.name;
  currentHue = color.hue || 'all';
  shuffleOrder();
  rerender();
  showToast(`已用 ${color.name} 换一组`);
}

function setUseActionState(button, label) {
  if (!button) return;

  window.clearTimeout(button._useActionTimer);
  const original = button.innerHTML;
  button.dataset.copied = 'true';
  const compact = button.classList.contains('use-favorite-button');
  button.innerHTML = compact
    ? `<iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon><span class="sr-only">${escapeHtml(label)}</span>`
    : `<iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon>${escapeHtml(label)}`;
  button._useActionTimer = window.setTimeout(() => {
    delete button.dataset.copied;
    button.innerHTML = original;
  }, 1300);
}

function setUseFavoriteState(button, active, card) {
  if (!button || !card) return;

  window.clearTimeout(button._useActionTimer);
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'} ${card.background.name} 和 ${card.text.name}`);
  button.title = active ? '取消收藏' : '收藏';
  button.dataset.feedback = 'true';
  button.innerHTML = `<iconify-icon icon="${active ? 'lucide:check' : 'lucide:heart-off'}" aria-hidden="true"></iconify-icon><span class="sr-only">${active ? '已收藏' : '已取消'}</span>`;
  button._useActionTimer = window.setTimeout(() => {
    delete button.dataset.feedback;
    button.innerHTML = `<iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon><span class="sr-only">${active ? '已收藏' : '收藏'}</span>`;
  }, 1300);
}

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function setTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('theme', nextTheme);
  } catch (error) {
    document.documentElement.dataset.theme = nextTheme;
  }
  themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  themeToggle?.setAttribute('aria-label', nextTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
  themeIcon?.setAttribute('icon', nextTheme === 'dark' ? 'lucide:sun' : 'lucide:moon');
  if (themeLabel) themeLabel.textContent = nextTheme === 'dark' ? '亮色' : '暗色';
  themeColorMeta?.setAttribute('content', nextTheme === 'dark' ? '#11100e' : '#f7f7f4');
}

function setMobileNavOpen(open) {
  if (!siteHeader || !navToggle) return;
  siteHeader.dataset.navOpen = String(open);
  navToggle.setAttribute('aria-expanded', String(open));
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

function queueMobileNavState() {
  window.cancelAnimationFrame(navResizeFrame);
  navResizeFrame = window.requestAnimationFrame(() => {
    if (window.matchMedia('(min-width: 721px)').matches) closeMobileNav();
  });
}

function buildFooterSpectrum() {
  if (!footerColorButtons.length) return;
  const pool = [...images].filter((image) => image.hex);
  footerColorButtons.forEach((button, index) => {
    const image = pool[(Math.floor(Math.random() * pool.length) + index * 37) % pool.length];
    const name = colorName(image);
    const copyText = `${name} ${image.hex}`;
    button.style.setProperty('--footer-color', image.hex);
    button.dataset.footerCopyValue = copyText;
    button.title = `复制 ${copyText}`;
  });
}

setTheme(currentTheme());
shuffleOrder();
buildFooterSpectrum();
rerender();

themeToggle?.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});
navToggle?.addEventListener('click', () => {
  const open = siteHeader?.dataset.navOpen === 'true';
  setMobileNavOpen(!open);
});
siteNav?.addEventListener('click', (event) => {
  if (event.target.closest('a, button')) closeMobileNav();
});
window.addEventListener('resize', queueMobileNavState);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});

footerColorButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const copyText = button.dataset.footerCopyValue;
    if (!copyText) return;
    await writeClipboard(copyText);
    button.dataset.copied = 'true';
    if (footerCopyStatus) {
      window.clearTimeout(footerCopyTimer);
      footerCopyStatus.textContent = `已复制：${copyText}`;
      footerCopyStatus.dataset.visible = 'true';
      footerCopyTimer = window.setTimeout(() => {
        footerCopyStatus.dataset.visible = 'false';
      }, 1600);
    }
    window.setTimeout(() => {
      delete button.dataset.copied;
    }, 1000);
  });
});

searchInput?.addEventListener('input', debounce(() => rerender(), 200));
biasInput?.addEventListener('input', () => rerender());

modebar?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-use-mode]');
  if (!button) return;
  currentMode = button.dataset.useMode;
  rerender(false);
});

huebar?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-use-hue]');
  if (!button) return;
  currentHue = button.dataset.useHue || 'all';
  rerender();
});

shuffleButton?.addEventListener('click', () => {
  shuffleOrder();
  rerender();
});

loadMoreButton?.addEventListener('click', () => {
  appendCards(STEP);
});

grid?.addEventListener('click', (event) => {
  const copyCardButton = event.target.closest('[data-use-copy-card]');
  if (copyCardButton) {
    event.stopPropagation();
    copyCard(copyCardButton.dataset.useCopyCard, false).then(() => {
      setUseActionState(copyCardButton, '已复制');
    });
    return;
  }

  const remixButton = event.target.closest('[data-use-remix]');
  if (remixButton) {
    event.stopPropagation();
    remixFromColor(remixButton.dataset.useRemix);
    return;
  }

  const favoriteButton = event.target.closest('[data-use-favorite]');
  if (favoriteButton) {
    event.stopPropagation();
    const card = findCard(favoriteButton.dataset.useFavorite);
    if (!card || !window.ZH_FAVORITES) return;
    const result = window.ZH_FAVORITES.toggle(useFavoriteItem(card));
    setUseFavoriteState(favoriteButton, result.active, card);
    return;
  }

  const colorButton = event.target.closest('[data-use-color]');
  if (colorButton) {
    event.stopPropagation();
    copyColor(colorButton.dataset.useColor);
    return;
  }

  const card = event.target.closest('[data-use-card]');
  if (card) {
    selectedId = card.dataset.useCard;
    renderGrid();
  }
});

grid?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('[data-use-card]');
  if (!card) return;
  event.preventDefault();
  selectedId = card.dataset.useCard;
  renderGrid();
});
