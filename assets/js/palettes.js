const images = window.TRADITIONAL_COLOR_IMAGES || [];
const harmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
const imagesById = new Map(images.map((image) => [image.id, image]));

const themeToggle = document.querySelector('[data-theme-toggle]');
const themeIcon = document.querySelector('[data-theme-icon]');
const themeColorMeta = document.querySelector('[data-theme-color]');
const feedList = document.querySelector('[data-feed-list]');
const relationList = document.querySelector('[data-relation-list]');
const toneList = document.querySelector('[data-tone-list]');
const searchInput = document.querySelector('[data-search]');
const shuffleButton = document.querySelector('[data-shuffle]');
const copySelectedButton = document.querySelector('[data-copy-selected]');
const paletteGrid = document.querySelector('[data-palette-grid]');
const resultCount = document.querySelector('[data-result-count]');
const loadMoreButton = document.querySelector('[data-load-more]');
const inspector = document.querySelector('[data-inspector]');
const toast = document.querySelector('[data-toast]');

const FEEDS = [
  { key: 'new', label: '新鲜', icon: '01' },
  { key: 'popular', label: '编号', icon: '02' },
  { key: 'random', label: '随机', icon: '03' },
  { key: 'collection', label: '收藏', icon: '04' },
];

const RELATIONS = [
  { key: 'curated', label: '主辅点缀', short: '角色明确', use: '网页、PPT、品牌起稿' },
  { key: 'same', label: '同类', short: '统一', use: '系列封面、品牌延展' },
  { key: 'analogous', label: '邻近', short: '柔和', use: '插画、封面、长图' },
  { key: 'complementary', label: '互补', short: '突出', use: '按钮、标题、活动信息' },
  { key: 'splitComplementary', label: '分裂互补', short: '有张力', use: '海报、社媒图、主视觉' },
  { key: 'triadic', label: '三角', short: '系列', use: '栏目、图表、多主题内容' },
  { key: 'tetradic', label: '四角', short: '丰富', use: '复杂系统，先限面积' },
  { key: 'temperatureContrast', label: '冷暖', short: '情绪对照', use: '活动页、展览、情绪反差' },
  { key: 'lighter', label: '明色', short: '留白', use: '背景、浅层模块、铺底' },
  { key: 'darker', label: '暗色', short: '压重', use: '标题、正文、深色页面' },
  { key: 'grayTone', label: '灰调', short: '降噪', use: '报告、作品集、密集界面' },
  { key: 'neutral', label: '中性', short: '秩序', use: '正文、分割线、底色' },
];

const TONES = [
  { key: 'all', label: '全部', icon: '00' },
  { key: 'warm', label: '暖色', icon: '暖' },
  { key: 'cold', label: '冷色', icon: '冷' },
  { key: 'light', label: '浅色', icon: '浅' },
  { key: 'dark', label: '深色', icon: '深' },
  { key: 'vivid', label: '高饱和', icon: '艳' },
  { key: 'soft', label: '低饱和', icon: '柔' },
  { key: 'red', label: '红', icon: '红' },
  { key: 'orange', label: '橙', icon: '橙' },
  { key: 'yellow', label: '黄', icon: '黄' },
  { key: 'green', label: '绿', icon: '绿' },
  { key: 'cyan', label: '青', icon: '青' },
  { key: 'blue', label: '蓝', icon: '蓝' },
  { key: 'purple', label: '紫', icon: '紫' },
  { key: 'neutralHue', label: '灰', icon: '灰' },
];

const ROLE_LABELS = ['主色', '辅助', '强调', '承托'];
const STACK_PATTERNS = [
  [41, 26, 18, 15],
  [44, 24, 18, 14],
  [38, 29, 19, 14],
  [43, 22, 21, 14],
  [36, 30, 20, 14],
  [40, 24, 22, 14],
  [45, 23, 17, 15],
  [39, 28, 18, 15],
];
const PALETTE_LIMIT_STEP = 36;
const FAVORITE_STORAGE_KEY = 'zhongguoPaletteFavorites';

let currentFeed = 'new';
let currentRelation = 'curated';
let currentTone = 'all';
let visibleCount = PALETTE_LIMIT_STEP;
let selectedPaletteId = '';
let favorites = readFavorites();
let randomRanks = new Map();
let toastTimer;
let paletteAutoObserver;

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

function hueFromHex(hex) {
  const rgb = rgbFromHex(hex);
  if (!rgb) return 'neutralHue';
  const hsl = hslFromRgb(rgb);
  if (hsl.s < 12) return 'neutralHue';
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

function readableTextColor(hex) {
  return relativeLuminance(hex) > 0.54 ? '#111111' : '#f7f7f4';
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function imageToColor(image) {
  if (!image?.hex) return null;
  const harmony = harmonies[image.id];
  return {
    id: image.id,
    name: colorName(image),
    hex: image.hex,
    hueFamily: harmony?.hueFamily || toneLabel(hueFromHex(image.hex)),
    temperature: harmony?.temperature || '',
    hsl: harmony?.hsl || hslFromRgb(rgbFromHex(image.hex)),
  };
}

function colorFromId(id) {
  return imageToColor(imagesById.get(id));
}

function uniqueColors(colors) {
  const seen = new Set();
  return colors.filter((color) => {
    if (!color?.hex || seen.has(color.id || color.hex)) return false;
    seen.add(color.id || color.hex);
    return true;
  });
}

function relationInfo(key = currentRelation) {
  return RELATIONS.find((item) => item.key === key) || RELATIONS[0];
}

function toneLabel(key) {
  return TONES.find((item) => item.key === key)?.label || '全部';
}

function fallbackIds(harmony) {
  return [
    ...(harmony?.secondary || []),
    ...(harmony?.accent || []),
    ...(harmony?.same || []),
    ...(harmony?.analogous || []),
    ...(harmony?.neutral || []),
    ...(harmony?.grayTone || []),
  ];
}

function paletteColorsFor(image, relationKey = currentRelation) {
  const harmony = harmonies[image.id];
  const anchor = imageToColor(image);
  if (!anchor) return [];

  const relationIds = relationKey === 'curated'
    ? [...(harmony?.secondary || []), ...(harmony?.accent || [])]
    : [...(harmony?.[relationKey] || [])];

  return uniqueColors([
    anchor,
    ...relationIds.map(colorFromId),
    ...fallbackIds(harmony).map(colorFromId),
  ]).slice(0, 4);
}

function paletteId(image, relationKey = currentRelation) {
  return `${image.id}-${relationKey}`;
}

function paletteFromImage(image, relationKey = currentRelation) {
  const harmony = harmonies[image.id];
  const colors = paletteColorsFor(image, relationKey);
  if (colors.length < 4) return null;
  const relation = relationInfo(relationKey);
  const id = paletteId(image, relationKey);
  return {
    id,
    anchorId: image.id,
    relationKey,
    relationLabel: relation.label,
    relationShort: relation.short,
    use: relation.use,
    colors,
    anchor: colors[0],
    hueFamily: harmony?.hueFamily || colors[0].hueFamily,
    temperature: harmony?.temperature || colors[0].temperature,
    hsl: harmony?.hsl || colors[0].hsl,
  };
}

function allPalettes() {
  return images
    .filter((image) => image.hex && harmonies[image.id])
    .map((image) => paletteFromImage(image, currentRelation))
    .filter(Boolean);
}

function matchesTone(palette) {
  if (currentTone === 'all') return true;
  if (currentTone === 'warm') return palette.temperature === '暖';
  if (currentTone === 'cold') return palette.temperature === '冷';
  if (currentTone === 'light') return palette.hsl.l >= 72;
  if (currentTone === 'dark') return palette.hsl.l <= 35;
  if (currentTone === 'vivid') return palette.hsl.s >= 70;
  if (currentTone === 'soft') return palette.hsl.s <= 36 || palette.hsl.l >= 82;
  return hueFromHex(palette.anchor.hex) === currentTone;
}

function paletteSearchText(palette) {
  return [
    palette.anchorId,
    palette.relationLabel,
    palette.relationShort,
    palette.hueFamily,
    palette.temperature,
    ...palette.colors.flatMap((color) => [color.id, color.name, color.hex]),
  ].join(' ').toLowerCase();
}

function filteredPalettes(options = {}) {
  const query = searchInput?.value.trim().toLowerCase() || '';
  let palettes = allPalettes()
    .filter(matchesTone)
    .filter((palette) => (query ? paletteSearchText(palette).includes(query) : true));

  if (currentFeed === 'collection') {
    palettes = palettes.filter((palette) => favorites.has(palette.id));
  }

  if (currentFeed === 'popular') {
    palettes.sort((first, second) => Number(first.anchorId) - Number(second.anchorId));
  } else if (currentFeed === 'random' && !options.ignoreRandom) {
    if (randomRanks.size === 0) randomRanks = shuffledPaletteRanks(palettes);
    palettes.sort((first, second) => (
      (randomRanks.get(first.id) ?? Number.MAX_SAFE_INTEGER)
      - (randomRanks.get(second.id) ?? Number.MAX_SAFE_INTEGER)
    ));
  } else {
    palettes.sort((first, second) => Number(second.anchorId) - Number(first.anchorId));
  }

  return palettes;
}

function randomInt(max) {
  if (max <= 0) return 0;
  if (window.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    do {
      window.crypto.getRandomValues(value);
    } while (value[0] >= limit);
    return value[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffledPaletteRanks(palettes) {
  const ids = palettes.map((palette) => palette.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }
  return new Map(ids.map((id, index) => [id, index]));
}

function shuffleCurrentPaletteOrder() {
  const previousFirstId = filteredPalettes()[0]?.id || '';
  const palettes = filteredPalettes({ ignoreRandom: true });
  randomRanks = shuffledPaletteRanks(palettes);

  if (palettes.length > 1 && randomRanks.get(previousFirstId) === 0) {
    const secondPalette = palettes.find((palette) => randomRanks.get(palette.id) === 1);
    if (secondPalette) {
      randomRanks.set(previousFirstId, 1);
      randomRanks.set(secondPalette.id, 0);
    }
  }
}

function readFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]'));
  } catch (error) {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([...favorites]));
  } catch (error) {
    // Favorites still work for the current page session.
  }
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
    // Theme still applies without storage.
  }
  themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  themeToggle?.setAttribute('aria-label', nextTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
  themeIcon?.setAttribute('icon', nextTheme === 'dark' ? 'lucide:sun' : 'lucide:moon');
  themeColorMeta?.setAttribute('content', nextTheme === 'dark' ? '#11100e' : '#f7f7f4');
}

function optionButtonMarkup(item, type, selectedKey) {
  const icon = item.icon || item.short || '';
  return `
    <button class="rail-button" type="button" data-${type}="${escapeHtml(item.key)}" aria-pressed="${item.key === selectedKey ? 'true' : 'false'}">
      <small>${escapeHtml(icon)}</small>
      <span>${escapeHtml(item.label)}</span>
    </button>
  `;
}

function renderOptions() {
  if (feedList) feedList.innerHTML = FEEDS.map((item) => optionButtonMarkup(item, 'feed', currentFeed)).join('');
  if (relationList) relationList.innerHTML = RELATIONS.map((item) => optionButtonMarkup(item, 'relation', currentRelation)).join('');
  if (toneList) toneList.innerHTML = TONES.map((item) => optionButtonMarkup(item, 'tone', currentTone)).join('');
}

function paletteText(palette) {
  return palette.colors
    .map((color, index) => `${ROLE_LABELS[index]}：${color.id}-${color.name} ${color.hex}`)
    .join('\n');
}

function paletteStackWeights(palette) {
  return STACK_PATTERNS[hashString(`${palette.id}-${palette.colors.map((color) => color.hex).join('-')}`) % STACK_PATTERNS.length];
}

function paletteStackStyle(palette) {
  const weights = paletteStackWeights(palette);
  return weights.map((weight, index) => `--stack-${index}: ${weight}fr`).join('; ');
}

function paletteCss(palette) {
  const [main, secondary, accent, support] = palette.colors;
  return [
    `--zh-palette-main: ${main.hex}; /* ${main.name} */`,
    `--zh-palette-secondary: ${secondary.hex}; /* ${secondary.name} */`,
    `--zh-palette-accent: ${accent.hex}; /* ${accent.name} */`,
    `--zh-palette-support: ${support.hex}; /* ${support.name} */`,
  ].join('\n');
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

function swatchMarkup(color, index) {
  return `
    <button class="palette-swatch" type="button" data-copy-color="${escapeHtml(color.id)}" style="--swatch: ${escapeHtml(color.hex)}; --swatch-text: ${readableTextColor(color.hex)}; --swatch-index: ${index};" aria-label="复制 ${escapeHtml(color.name)} ${escapeHtml(color.hex)}">
      <span class="palette-swatch-label">
        <strong>${escapeHtml(color.name)}</strong>
        <small>${escapeHtml(color.hex)}</small>
      </span>
    </button>
  `;
}

function paletteCardMarkup(palette) {
  const favorite = favorites.has(palette.id);
  const selected = palette.id === selectedPaletteId;
  const favoriteLabel = favorite ? '<span>已收藏</span>' : '';

  return `
    <article class="palette-card" tabindex="0" data-palette-id="${escapeHtml(palette.id)}" aria-selected="${selected ? 'true' : 'false'}">
      <div class="palette-stack" style="${paletteStackStyle(palette)}" aria-label="${escapeHtml(palette.relationLabel)}配色">
        ${palette.colors.map(swatchMarkup).join('')}
      </div>
      <footer class="palette-card-footer">
        <button class="favorite-button" type="button" data-favorite="${escapeHtml(palette.id)}" aria-pressed="${favorite ? 'true' : 'false'}" aria-label="${favorite ? '取消收藏' : '收藏'} ${escapeHtml(palette.anchor.name)} 配色">
          <iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon>
          ${favoriteLabel}
        </button>
        <span class="palette-caption">${escapeHtml(palette.anchor.id)} · ${escapeHtml(palette.relationLabel)} · ${escapeHtml(palette.hueFamily)}</span>
        <button class="copy-palette-button" type="button" data-copy-palette="${escapeHtml(palette.id)}">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          整组
        </button>
      </footer>
    </article>
  `;
}

function currentPaletteList() {
  return filteredPalettes();
}

function findPalette(id) {
  return currentPaletteList().find((palette) => palette.id === id)
    || allPalettes().find((palette) => palette.id === id)
    || currentPaletteList()[0]
    || null;
}

function renderGrid() {
  if (!paletteGrid) return;
  const palettes = currentPaletteList();
  const visible = palettes.slice(0, visibleCount);
  if (!selectedPaletteId || !palettes.some((palette) => palette.id === selectedPaletteId)) {
    selectedPaletteId = visible[0]?.id || '';
  }

  paletteGrid.innerHTML = visible.length
    ? visible.map(paletteCardMarkup).join('')
    : '<div class="empty-state"><strong>没有找到配色</strong><span>换一个关键词、关系或色彩气质试试。</span></div>';

  if (resultCount) {
    resultCount.textContent = `已显示 ${visible.length.toLocaleString('zh-CN')} / ${palettes.length.toLocaleString('zh-CN')} 组配色`;
  }
  if (loadMoreButton) {
    const autoLoadSupported = 'IntersectionObserver' in window;
    loadMoreButton.hidden = autoLoadSupported || visible.length >= palettes.length;
  }
  setupAutoLoad();
  renderInspector(findPalette(selectedPaletteId));
}

function setupAutoLoad() {
  if (!paletteGrid || !loadMoreButton || !('IntersectionObserver' in window)) return;

  const trigger = loadMoreButton.closest('.palette-more') || loadMoreButton;
  paletteAutoObserver?.disconnect();
  paletteAutoObserver = new IntersectionObserver((entries) => {
    const palettes = currentPaletteList();
    const shouldLoad = entries.some((entry) => entry.isIntersecting) && visibleCount < palettes.length;
    if (shouldLoad) appendPalettes(PALETTE_LIMIT_STEP);
  }, { rootMargin: '520px 0px' });
  paletteAutoObserver.observe(trigger);
}

function appendPalettes(count) {
  const palettes = currentPaletteList();
  const currentVisible = Math.min(visibleCount, palettes.length);
  const nextVisible = Math.min(currentVisible + count, palettes.length);
  if (nextVisible <= currentVisible) return;

  visibleCount = nextVisible;
  renderGrid();
}

function roleMarkup(color, index) {
  return `
    <button class="copy-role-button" type="button" data-copy-inspector-color="${escapeHtml(color.id)}" style="--role-color: ${escapeHtml(color.hex)}">
      <i aria-hidden="true"></i>
      <span>
        <strong>${escapeHtml(ROLE_LABELS[index])} · ${escapeHtml(color.name)}</strong>
        <small>${escapeHtml(color.id)} · ${escapeHtml(color.hueFamily || '')}</small>
      </span>
      <em>${escapeHtml(color.hex)}</em>
    </button>
  `;
}

function renderInspector(palette) {
  if (!inspector) return;
  if (!palette) {
    inspector.innerHTML = `
      <div class="inspector-empty">
        <span>配色</span>
        <strong>选一组配色</strong>
        <p>显示角色色和 CSS 变量。</p>
      </div>
    `;
    return;
  }

  inspector.innerHTML = `
    <div class="inspector-content">
      <div>
        <span class="inspector-kicker">配色 / ${escapeHtml(palette.relationLabel)}</span>
        <h2 class="inspector-title">${escapeHtml(palette.anchor.name)}</h2>
        <p class="inspector-note">${escapeHtml(palette.use)}</p>
        <div class="inspector-stack" style="${paletteStackStyle(palette)}" aria-hidden="true">
          ${palette.colors.map((color) => `<span style="--swatch: ${escapeHtml(color.hex)}"></span>`).join('')}
        </div>
      </div>
      <div class="inspector-actions">
        <button class="inspector-action" type="button" data-inspector-copy="palette">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          复制整组色值
        </button>
        <button class="inspector-action" type="button" data-inspector-copy="css">
          <iconify-icon icon="lucide:braces" aria-hidden="true"></iconify-icon>
          复制 CSS 变量
        </button>
      </div>
      <div class="role-list">
        ${palette.colors.map(roleMarkup).join('')}
      </div>
      <div class="inspector-use">
        <strong>建议</strong>
        <p>${escapeHtml(palette.colors[0].name)} 做底，${escapeHtml(palette.colors[2].name)} 做重点。</p>
      </div>
    </div>
  `;
}

function rerender(resetVisible = true) {
  if (resetVisible) visibleCount = PALETTE_LIMIT_STEP;
  renderOptions();
  renderGrid();
}

async function copyColorById(id) {
  const color = colorFromId(id);
  if (!color) return;
  await writeClipboard(`${color.name} ${color.hex}`);
  showToast(`已复制：${color.name} ${color.hex}`);
}

async function copyPaletteById(id) {
  const palette = findPalette(id);
  if (!palette) return;
  await writeClipboard(paletteText(palette));
  showToast(`已复制整组：${palette.anchor.name} ${palette.relationLabel}`);
}

function selectPalette(id) {
  selectedPaletteId = id;
  renderGrid();
}

function toggleFavorite(id) {
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast('已取消收藏');
  } else {
    favorites.add(id);
    showToast('已加入收藏');
  }
  saveFavorites();
  rerender(false);
}

function bindOptionClicks(container, selector, callback) {
  container?.addEventListener('click', (event) => {
    const button = event.target.closest(selector);
    if (!button) return;
    callback(button);
  });
}

setTheme(currentTheme());
renderOptions();
renderGrid();

themeToggle?.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});

bindOptionClicks(feedList, '[data-feed]', (button) => {
  currentFeed = button.dataset.feed;
  if (currentFeed === 'random') shuffleCurrentPaletteOrder();
  rerender();
});

bindOptionClicks(relationList, '[data-relation]', (button) => {
  currentRelation = button.dataset.relation;
  rerender();
});

bindOptionClicks(toneList, '[data-tone]', (button) => {
  currentTone = button.dataset.tone;
  rerender();
});

searchInput?.addEventListener('input', () => rerender());

shuffleButton?.addEventListener('click', () => {
  currentFeed = 'random';
  shuffleCurrentPaletteOrder();
  rerender();
});

copySelectedButton?.addEventListener('click', () => {
  if (selectedPaletteId) copyPaletteById(selectedPaletteId);
});

loadMoreButton?.addEventListener('click', () => {
  appendPalettes(PALETTE_LIMIT_STEP);
});

paletteGrid?.addEventListener('click', (event) => {
  const colorButton = event.target.closest('[data-copy-color]');
  if (colorButton) {
    event.stopPropagation();
    copyColorById(colorButton.dataset.copyColor);
    return;
  }

  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) {
    event.stopPropagation();
    toggleFavorite(favoriteButton.dataset.favorite);
    return;
  }

  const copyButton = event.target.closest('[data-copy-palette]');
  if (copyButton) {
    event.stopPropagation();
    copyPaletteById(copyButton.dataset.copyPalette);
    return;
  }

  const card = event.target.closest('[data-palette-id]');
  if (card) selectPalette(card.dataset.paletteId);
});

paletteGrid?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('[data-palette-id]');
  if (!card) return;
  event.preventDefault();
  selectPalette(card.dataset.paletteId);
});

inspector?.addEventListener('click', async (event) => {
  const colorButton = event.target.closest('[data-copy-inspector-color]');
  if (colorButton) {
    await copyColorById(colorButton.dataset.copyInspectorColor);
    return;
  }

  const action = event.target.closest('[data-inspector-copy]')?.dataset.inspectorCopy;
  const palette = findPalette(selectedPaletteId);
  if (!action || !palette) return;

  if (action === 'css') {
    await writeClipboard(paletteCss(palette));
    showToast('已复制 CSS 变量');
  } else {
    await writeClipboard(paletteText(palette));
    showToast(`已复制整组：${palette.anchor.name} ${palette.relationLabel}`);
  }
});
