const images = window.TRADITIONAL_COLOR_IMAGES || [];
const colorHarmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
const harmonyUsage = window.TRADITIONAL_COLOR_HARMONY_USAGE || {};
const project = window.TRADITIONAL_COLOR_PROJECT || {
  count: images.length,
  totalBytes: images.reduce((total, image) => total + image.size, 0),
  archiveName: 'zhongguo-traditional-colors-images.zip',
};
const imagesById = new Map(images.map((image) => [image.id, image]));

const gallery = document.querySelector('[data-gallery]');
const styleLab = document.querySelector('[data-style-lab]');
const styleRefreshButton = document.querySelector('[data-style-refresh]');
const styleCopyAllButton = document.querySelector('[data-style-copy-all]');
const styleCopyCssButton = document.querySelector('[data-style-copy-css]');
const styleSchemeFavoriteButton = document.querySelector('[data-style-scheme-favorite]');
const styleSchemeFavoriteLabel = document.querySelector('[data-style-scheme-favorite-label]');
const styleStatus = document.querySelector('[data-style-status]');
const styleAnchor = document.querySelector('[data-style-anchor]');
const stylePalette = document.querySelector('[data-style-palette]');
const styleReadiness = document.querySelector('[data-style-readiness]');
const styleSceneList = document.querySelector('[data-style-scene-list]');
const styleSceneSummary = document.querySelector('[data-style-scene-summary]');
const styleIntentList = document.querySelector('[data-style-intent-list]');
const styleColorSearch = document.querySelector('[data-style-color-search]');
const styleColorOptions = document.querySelector('[data-style-color-options]');
const styleAnchorMeta = document.querySelector('[data-style-anchor-meta]');
const styleAnchorSwatch = document.querySelector('[data-style-anchor-swatch]');
const styleAnchorButton = document.querySelector('[data-style-anchor-button]');
const styleFormatSelect = document.querySelector('[data-style-format]');
const styleColorDialog = document.querySelector('[data-style-color-dialog]');
const styleColorDialogKicker = document.querySelector('[data-style-color-dialog-kicker]');
const styleColorDialogTitle = document.querySelector('[data-style-color-dialog-title]');
const styleColorDialogNote = document.querySelector('[data-style-color-dialog-note]');
const styleColorRecommendations = document.querySelector('[data-style-color-recommendations]');
const styleColorGrid = document.querySelector('[data-style-color-grid]');
const styleColorPickerSearch = document.querySelector('[data-style-color-picker-search]');
const styleColorHueButtons = document.querySelectorAll('[data-style-color-hue]');
const styleColorDialogStatus = document.querySelector('[data-style-color-dialog-status]');
const closeStyleColorButton = document.querySelector('[data-close-style-color]');
const styleColorRandomButton = document.querySelector('[data-style-color-random]');
const styleColorCopyCurrentButton = document.querySelector('[data-style-color-copy-current]');
const heroMosaic = document.querySelector('[data-hero-mosaic]');
const searchInput = document.querySelector('[data-search]');
const hueFilter = document.querySelector('[data-hue-filter]');
const loadMoreButton = document.querySelector('[data-load-more]');
const shuffleButton = document.querySelector('[data-shuffle]');
const galleryStatus = document.querySelector('[data-gallery-status]');
const zipButton = document.querySelector('[data-download-zip]');
const zipStatus = document.querySelector('[data-download-status]');
const progressBar = document.querySelector('[data-progress-bar]');
const masterListDialog = document.querySelector('[data-master-list-dialog]');
const masterColorList = document.querySelector('[data-master-color-list]');
const openMasterListButtons = document.querySelectorAll('[data-open-master-list]');
const closeMasterListButton = document.querySelector('[data-close-master-list]');
const copyMasterListButton = document.querySelector('[data-copy-master-list]');
const masterListStatus = document.querySelector('[data-master-list-status]');
const masterSearchInput = document.querySelector('[data-master-search]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeToggleIcon = document.querySelector('[data-theme-icon]');
const themeToggleLabel = document.querySelector('[data-theme-label]');
const themeColorMeta = document.querySelector('[data-theme-color]');
const siteHeader = document.querySelector('.site-header');
const siteNav = document.querySelector('#site-nav');
const navToggle = document.querySelector('[data-nav-toggle]');
const footerColorButtons = document.querySelectorAll('[data-footer-color]');
const footerCopyStatus = document.querySelector('[data-footer-copy-status]');
const scrollUpButton = document.querySelector('[data-scroll-up]');
const scrollDownButton = document.querySelector('[data-scroll-down]');
const skillToggleButtons = document.querySelectorAll('[data-skill-toggle]');
const skillAnchorLinks = document.querySelectorAll('[data-skill-anchor]');
const titleHoverElements = document.querySelectorAll('h1, h2, h3');
const heroPreviewDialog = document.querySelector('[data-hero-preview-dialog]');
const heroPreviewImage = document.querySelector('[data-hero-preview-image]');
const heroPreviewMedia = document.querySelector('.hero-preview-media');
const heroPreviewGuide = document.querySelector('[data-preview-left-guide]');
const heroPreviewContent = document.querySelector('.hero-preview-content');
const heroPreviewTitle = document.querySelector('[data-hero-preview-title]');
const heroPreviewHex = document.querySelector('[data-hero-preview-hex]');
const heroPreviewHue = document.querySelector('[data-hero-preview-hue]');
const heroPreviewFile = document.querySelector('[data-hero-preview-file]');
const heroPreviewSize = document.querySelector('[data-hero-preview-size]');
const heroPreviewDownload = document.querySelector('[data-hero-preview-download]');
const heroPreviewStatus = document.querySelector('[data-hero-preview-status]');
const closeHeroPreviewButton = document.querySelector('[data-close-hero-preview]');
const copyHeroPreviewButton = document.querySelector('[data-copy-hero-preview]');
const usePreviewColorButton = document.querySelector('[data-use-preview-color]');
const heroPreviewFormat = document.querySelector('[data-hero-preview-format]');
const heroPreviewHarmony = document.querySelector('[data-hero-preview-harmony]');
const heroPreviewHarmonyNote = document.querySelector('[data-hero-preview-harmony-note]');
const heroPreviewRoleMap = document.querySelector('[data-hero-preview-role-map]');
const harmonyTabs = document.querySelector('[data-harmony-tabs]');
const harmonyPanel = document.querySelector('[data-harmony-panel]');
const gradientLogicDisabled = document.body?.hasAttribute('data-no-gradient-logic');

const GALLERY_PAGE_SIZE = 24;

let visibleCount = GALLERY_PAGE_SIZE;
let currentItems = randomizeImageOrder(images);
let shuffled = true;
let currentHue = 'all';
let selectedColorValueType = getSavedColorValueType();
let footerCopyTimer;
let scrollControlFrame;
let heroPreviewResizeFrame;
let currentHeroPreviewImage;
let currentHarmonyKey = 'same';
let navResizeFrame;
let styleColorPickerHue = 'all';
let galleryAutoObserver;

const TITLE_TONE_MAP = [
  { match: ['hero', 'top'], hues: ['red', 'orange', 'yellow'] },
  { match: ['gallery', '色卡', '图库', '筛选'], hues: ['blue', 'cyan', 'green'] },
  { match: ['style', '样式', '封面', '排版'], hues: ['red', 'orange', 'blue', 'green'] },
  { match: ['audit', '清单', '索引', '覆盖'], hues: ['blue', 'green', 'neutral'] },
  { match: ['skills', 'skill', 'xxd', '工作流'], hues: ['purple', 'blue', 'cyan'] },
  { match: ['download', '下载', 'zip', '素材'], hues: ['orange', 'red', 'yellow'] },
  { match: ['author', '作者', '小小东', '支持'], hues: ['red', 'purple', 'orange'] },
  { match: ['open', '开放', 'github', '贡献'], hues: ['green', 'cyan', 'blue'] },
];

const COLOR_VALUE_TYPES = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'cmyk', label: 'CMYK' },
];

const GALLERY_RANDOM_HUES = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'neutral'];

const HARMONY_USAGE_NOTE = '点色块复制，格式跟随上方选择。';

const HARMONY_ROLE_TYPES = [
  { key: 'main', label: '背景色', context: '背景 / 大面积', hint: '铺底、主视觉、页面基调' },
  { key: 'secondary', label: '辅助色', context: '模块 / 辅助信息', hint: '分区、卡片、次级内容' },
  { key: 'accent', label: '强调色', context: '按钮 / 重点', hint: '按钮、标题、数字或焦点' },
];

const HARMONY_RELATION_KEYS = [
  'same',
  'analogous',
  'complementary',
  'splitComplementary',
  'triadic',
  'tetradic',
  'temperatureContrast',
  'lighter',
  'darker',
  'grayTone',
  'neutral',
];

const HARMONY_RELATION_TYPES = HARMONY_RELATION_KEYS
  .map((key) => ({ key, ...(harmonyUsage[key] || {}) }))
  .filter((type) => type.label);
const debounce = window.ZH_UTILS?.debounce || ((fn, delay) => {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
});

const STYLE_LAB_ROLES = [
  { key: 'background', label: '背景色', use: '大面积铺底', ratio: '60%' },
  { key: 'title', label: '标题色', use: '标题和重点', ratio: '20%' },
  { key: 'body', label: '正文色', use: '正文和说明', ratio: '12%' },
  { key: 'support', label: '按钮色', use: '按钮和链接', ratio: '6%' },
  { key: 'accent', label: '点缀色', use: '细线和角标', ratio: '2%' },
];

const STYLE_LAB_INTENTS = [
  {
    key: 'safe',
    label: '稳妥',
    intent: '能落地',
    relationKeys: ['same', 'analogous', 'neutral', 'grayTone', 'lighter', 'darker'],
    supportKeys: ['darker', 'lighter', 'same', 'neutral'],
    accentKeys: ['analogous', 'grayTone', 'neutral'],
    summary: '统一、可读、低风险。',
    theory: '同类、邻近、中性色。',
  },
  {
    key: 'vivid',
    label: '醒目',
    intent: '突出重点',
    relationKeys: ['complementary', 'splitComplementary', 'triadic', 'temperatureContrast'],
    supportKeys: ['complementary', 'splitComplementary', 'temperatureContrast'],
    accentKeys: ['triadic', 'complementary', 'temperatureContrast'],
    summary: '按钮、标题和数字更醒目。',
    theory: '互补、分裂互补、冷暖。',
  },
  {
    key: 'elegant',
    label: '雅致',
    intent: '控制气质',
    relationKeys: ['grayTone', 'neutral', 'lighter', 'darker', 'analogous'],
    supportKeys: ['grayTone', 'darker', 'neutral', 'analogous'],
    accentKeys: ['lighter', 'grayTone', 'analogous'],
    summary: '克制、留白、适合长内容。',
    theory: '灰调、明暗、邻近。',
  },
];

const STYLE_LAB_SCENES = [
  {
    key: 'web',
    label: '网页',
    short: '首页 / 产品页',
    scene: '官网首页、产品页、作品集、工具首屏',
    size: '桌面首屏 / 1440x900',
    layout: '顶栏 / 左侧主张 / 右侧视觉 / CTA / 功能卡',
    structure: '先保证首屏层级，行动色只给 CTA 和关键入口。',
    relationKeys: ['neutral', 'lighter', 'darker', 'analogous'],
    overline: 'WEB HERO',
    title: '中国色也能进入现代网页',
    subtitle: '把传统色拆成背景、标题、正文、按钮和视觉块。',
    meta: '导航 / Hero / Feature',
    action: '查看方案',
  },
  {
    key: 'ppt',
    label: 'PPT',
    short: '标题页 / 课件',
    scene: '汇报封面、课程课件、方案演示、知识卡片',
    size: '16:9 / 1920x1080',
    layout: '章节号 / 大标题 / 右侧视觉 / 页脚信息',
    structure: '一页只服务一个结论，辅助色承担图形和页脚。',
    relationKeys: ['same', 'neutral', 'grayTone', 'lighter', 'darker'],
    overline: 'SLIDE 01',
    title: '东方色彩方案',
    subtitle: '标题、结论、结构先稳定。',
    meta: '汇报 / 课程 / 方案',
    action: '重点结论',
  },
  {
    key: 'cover',
    label: '封面',
    short: '书封 / 课程',
    scene: '书籍封面、课程封面、作品集封面、系列专栏封面',
    size: '竖版封面 / 1080x1440',
    layout: '系列名 / 主标题 / 副标题 / 作者或期数',
    structure: '标题居中压住识别，点缀色只做系列记忆点。',
    relationKeys: ['analogous', 'grayTone', 'neutral', 'complementary'],
    overline: 'COVER',
    title: '春山如黛',
    subtitle: '先定气质，再定节奏。',
    meta: '小小东整理 / 传统色',
    action: '系列封面',
  },
  {
    key: 'poster',
    label: '海报',
    short: '活动 / 宣传',
    scene: '活动海报、直播预告、展览视觉、公开课宣传',
    size: '移动端海报 / 1080x1920',
    layout: '日期 / 活动名 / 卖点 / 时间地点 / 报名入口',
    structure: '日期和标题先抢视线，行动色给报名入口。',
    relationKeys: ['complementary', 'splitComplementary', 'temperatureContrast', 'triadic'],
    overline: 'ONLINE TALK',
    title: '色彩公开课',
    subtitle: '传统色在现代内容里的实际用法。',
    meta: '06.18 / 20:00',
    action: '立即报名',
  },
  {
    key: 'brand',
    label: '品牌',
    short: '识别 / 系统',
    scene: '品牌色板、视觉规范、名片、包装起稿',
    size: '品牌板 / 1920x1080',
    layout: '标志 / 品牌名 / 标语 / 色板 / 应用触点',
    structure: '主色负责识别，辅助色拆给物料、按钮和系统底色。',
    relationKeys: ['neutral', 'grayTone', 'same', 'analogous', 'darker'],
    overline: 'BRAND SYSTEM',
    title: '小满茶事',
    subtitle: '传统色转成品牌角色。',
    meta: '主色 / 行动色 / 点缀色',
    action: '品牌触点',
  },
  {
    key: 'social',
    label: '社媒图',
    short: '小红书 / 封面',
    scene: '小红书封面、社媒长图首屏、诗句短卡、公众号配图',
    size: '小红书封面 / 1242x1660',
    layout: '系列标签 / 封面标题 / 一句解释 / 作者或栏目',
    structure: '标题必须能在信息流缩略图里读清楚，背景只承载气质。',
    relationKeys: ['analogous', 'complementary', 'neutral', 'lighter', 'grayTone'],
    overline: 'SOCIAL CARD',
    title: '风过庭前，花影不语',
    subtitle: '留白给短句和摘录。',
    meta: '中式短卡 / 系列内容',
    action: '保存色板',
  },
];

let currentStyleLabScheme;
let currentStyleAnchorImage = styleLabInitialColorImage();
let currentStyleSceneKey = 'web';
let currentStyleIntentKey = 'safe';
let currentStyleRoleOverrides = {};
let styleRoleReplacementKey = '';

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function encodedPath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function thumbnailPath(image) {
  return `thumbnails/color-card-${image.id}.jpg`;
}

function colorTitle(image) {
  return image.file.replace(/\.[^.]+$/, '');
}

function colorName(image) {
  return colorTitle(image).replace(/^\d{3}-/, '');
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

function normalize(value) {
  return value.trim().toLowerCase();
}

function getSavedColorValueType() {
  try {
    const value = localStorage.getItem('colorValueType');
    return ['hex', 'rgb', 'hsl', 'cmyk'].includes(value) ? value : 'hex';
  } catch (error) {
    return 'hex';
  }
}

function styleLabInitialColorImage() {
  const colorId = new URLSearchParams(window.location.search).get('color');
  const image = colorId ? imagesById.get(colorId) : null;
  return image?.hex ? image : null;
}

function saveColorValueType(type) {
  selectedColorValueType = ['hex', 'rgb', 'hsl', 'cmyk'].includes(type) ? type : 'hex';
  try {
    localStorage.setItem('colorValueType', selectedColorValueType);
  } catch (error) {
    // The current selection still applies if storage is unavailable.
  }
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

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: Math.round(((1 - red - k) / (1 - k)) * 100),
    m: Math.round(((1 - green - k) / (1 - k)) * 100),
    y: Math.round(((1 - blue - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function colorValue(image, type = selectedColorValueType) {
  const hex = image.hex || '';
  const rgb = rgbFromHex(hex);
  if (!rgb) return hex;

  if (type === 'rgb') return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  if (type === 'hsl') {
    const hsl = hslFromRgb(rgb);
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }
  if (type === 'cmyk') {
    const cmyk = cmykFromRgb(rgb);
    return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
  }
  return hex;
}

function colorValueLabel(type = selectedColorValueType) {
  return COLOR_VALUE_TYPES.find((item) => item.value === type)?.label || 'HEX';
}

function hueFromHex(hex) {
  if (!hex) return 'neutral';

  const rgb = rgbFromHex(hex);
  if (!rgb) return 'neutral';

  const red = rgb.r / 255;
  const green = rgb.g / 255;
  const blue = rgb.b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  if (saturation < 0.12) return 'neutral';

  let hue = 0;
  if (max === red) hue = ((green - blue) / delta) % 6;
  if (max === green) hue = (blue - red) / delta + 2;
  if (max === blue) hue = (red - green) / delta + 4;
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  if (hue < 15 || hue >= 345) return 'red';
  if (hue < 45) return 'orange';
  if (hue < 75) return 'yellow';
  if (hue < 155) return 'green';
  if (hue < 195) return 'cyan';
  if (hue < 255) return 'blue';
  if (hue < 315) return 'purple';
  return 'red';
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
    // Theme still applies for the current page if storage is unavailable.
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? '切换到亮色版本' : '切换到暗色版本');
  }
  if (themeToggleLabel) {
    themeToggleLabel.textContent = nextTheme === 'dark' ? '亮色' : '暗色';
  }
  if (themeToggleIcon) {
    themeToggleIcon.setAttribute('icon', nextTheme === 'dark' ? 'lucide:sun' : 'lucide:moon');
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', nextTheme === 'dark' ? '#11100e' : '#f7f7f4');
  }
}

function setMobileNavOpen(open) {
  if (!siteHeader || !navToggle) return;

  siteHeader.dataset.navOpen = open ? 'true' : 'false';
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? '收起导航' : '展开导航');
  const icon = navToggle.querySelector('iconify-icon');
  if (icon) icon.setAttribute('icon', open ? 'lucide:x' : 'lucide:menu');
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

function queueMobileNavState() {
  if (navResizeFrame) return;
  navResizeFrame = window.requestAnimationFrame(() => {
    navResizeFrame = 0;
    if (window.matchMedia('(min-width: 721px)').matches) closeMobileNav();
  });
}

function updateStats() {
  document.querySelectorAll('[data-count]').forEach((node) => {
    node.textContent = project.count.toLocaleString('zh-CN');
  });
  document.querySelectorAll('[data-total-size]').forEach((node) => {
    node.textContent = formatBytes(project.totalBytes);
  });
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

function randomizeImageOrder(items) {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool;
}

function galleryHueItems(hue) {
  return images.filter((image) => image.hex && hueFromHex(image.hex) === hue);
}

function availableGalleryRandomHues() {
  return GALLERY_RANDOM_HUES.filter((hue) => galleryHueItems(hue).length);
}

function readLastRandomGalleryHue() {
  try {
    return sessionStorage.getItem('lastRandomGalleryHue') || '';
  } catch (error) {
    return '';
  }
}

function saveLastRandomGalleryHue(hue) {
  try {
    sessionStorage.setItem('lastRandomGalleryHue', hue);
  } catch (error) {
    // Random hue selection still works when session storage is unavailable.
  }
}

function randomGalleryHue() {
  const availableHues = availableGalleryRandomHues();
  const previousHue = readLastRandomGalleryHue();
  const huePool = availableHues.length > 1
    ? availableHues.filter((hue) => hue !== previousHue)
    : availableHues;
  const hue = huePool[randomInt(huePool.length)] || availableHues[0] || 'all';
  saveLastRandomGalleryHue(hue);
  return hue;
}

function randomColorItems(count) {
  const pool = randomizeImageOrder(images.filter((image) => image.hex));
  return pool.slice(0, count);
}

function parseRgbColor(value) {
  const match = value?.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;

  const numbers = match[1].match(/[\d.]+/g)?.map(Number) || [];
  if (numbers.length < 3) return null;

  return {
    r: numbers[0],
    g: numbers[1],
    b: numbers[2],
    a: numbers[3] ?? 1,
  };
}

function cssColorToRgb(value) {
  const hex = rgbFromHex(value?.trim());
  if (hex) return { ...hex, a: 1 };
  return parseRgbColor(value);
}

function nearestBackgroundRgb(node) {
  let current = node;
  while (current && current !== document.documentElement) {
    const background = cssColorToRgb(window.getComputedStyle(current).backgroundColor);
    if (background && background.a > 0) return background;
    current = current.parentElement;
  }

  return currentTheme() === 'dark'
    ? { r: 17, g: 16, b: 14, a: 1 }
    : { r: 247, g: 247, b: 244, a: 1 };
}

function hoverBackgroundRgb(title) {
  const hoverSurface = title.closest('.open-primary, .open-step');
  if (!hoverSurface) return null;

  const hoverColor = window.getComputedStyle(hoverSurface).getPropertyValue('--hover-bg');
  return cssColorToRgb(hoverColor);
}

function luminanceChannel(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance({ r, g, b }) {
  return (0.2126 * luminanceChannel(r)) + (0.7152 * luminanceChannel(g)) + (0.0722 * luminanceChannel(b));
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function displayColorFromImage(image) {
  if (!image?.hex) return null;

  return {
    id: image.id,
    name: colorName(image),
    hex: image.hex,
  };
}

function styleColorOptionValue(image) {
  return `${image.id} ${colorName(image)} ${image.hex || ''}`.trim();
}

function styleColorSearchText(image) {
  return `${image.id} ${colorName(image)} ${image.file} ${image.hex || ''}`.toLowerCase();
}

function colorQueryMatchesImage(image, query) {
  const normalized = normalize(query || '');
  if (!normalized) return true;
  if (window.ZH_COLOR_SEARCH?.matchesImage) {
    return window.ZH_COLOR_SEARCH.matchesImage(image, normalized);
  }
  return styleColorSearchText(image).includes(normalized);
}

function bestColorQueryImage(query) {
  const normalized = normalize(query || '');
  if (!normalized) return null;
  return window.ZH_COLOR_SEARCH?.rankedImages?.(normalized, 1)?.[0] || null;
}

function renderStyleColorOptions() {
  if (!styleColorOptions) return;

  styleColorOptions.innerHTML = images
    .filter((image) => image.hex)
    .map((image) => `<option value="${escapeHtml(styleColorOptionValue(image))}"></option>`)
    .join('');
}

function findStyleColorImage(value) {
  const query = normalize(value || '');
  if (!query) return null;

  const idMatch = query.match(/\b\d{3}\b/);
  if (idMatch) {
    const exact = imagesById.get(idMatch[0]);
    if (exact?.hex) return exact;
  }

  const hexMatch = query.match(/#?[0-9a-f]{6}/i);
  if (hexMatch) {
    const normalizedHex = `#${hexMatch[0].replace('#', '')}`.toLowerCase();
    const exact = images.find((image) => image.hex?.toLowerCase() === normalizedHex);
    if (exact) return exact;
  }

  return images.find((image) => image.hex && styleColorSearchText(image).includes(query))
    || bestColorQueryImage(query)
    || null;
}

function styleColoredColors(colors) {
  return uniqueDisplayColors(colors).filter((color) => hueFromHex(color.hex) !== 'neutral');
}

function styleColorKey(color) {
  return color?.id || color?.hex || '';
}

function styleColorLuminance(color) {
  const rgb = rgbFromHex(color?.hex);
  return rgb ? relativeLuminance(rgb) : 0;
}

function styleColorContrast(first, second) {
  const firstRgb = rgbFromHex(first?.hex);
  const secondRgb = rgbFromHex(second?.hex);
  if (!firstRgb || !secondRgb) return 0;
  return contrastRatio(firstRgb, secondRgb);
}

function uniqueDisplayColors(colors) {
  const used = new Set();

  return colors
    .map((color) => lookupDisplayColor(color))
    .filter((color) => color.hex)
    .filter((color) => {
      const key = styleColorKey(color);
      if (used.has(key)) return false;
      used.add(key);
      return true;
    });
}

function allDisplayColors() {
  return images.map(displayColorFromImage).filter(Boolean);
}

function relationDisplayColors(harmony, keys) {
  if (!harmony) return [];

  return uniqueDisplayColors(keys.flatMap((key) => harmony[key] || []));
}

function styleLabScene(key = currentStyleSceneKey) {
  return STYLE_LAB_SCENES.find((scene) => scene.key === key) || STYLE_LAB_SCENES[0];
}

function styleLabIntent(key = currentStyleIntentKey) {
  return STYLE_LAB_INTENTS.find((intent) => intent.key === key) || STYLE_LAB_INTENTS[0];
}

function styleLabRelationColors(harmony, scene = styleLabScene(), intent = styleLabIntent()) {
  return relationDisplayColors(harmony, [
    ...intent.relationKeys,
    ...scene.relationKeys,
  ]);
}

function sortedStyleColors(colors, direction = 'light') {
  const multiplier = direction === 'dark' ? 1 : -1;
  return [...colors].sort((first, second) => (
    (styleColorLuminance(first) - styleColorLuminance(second)) * multiplier
  ));
}

function firstUnusedColor(colors, used, predicate = () => true) {
  return uniqueDisplayColors(colors).find((color) => {
    const key = styleColorKey(color);
    return !used.has(key) && predicate(color);
  }) || null;
}

function bestContrastColor(colors, background, used, minimum = 3) {
  const ranked = uniqueDisplayColors(colors)
    .filter((color) => !used.has(styleColorKey(color)))
    .map((color) => ({
      color,
      contrast: styleColorContrast(color, background),
    }))
    .sort((first, second) => second.contrast - first.contrast);

  return ranked.find((item) => item.contrast >= minimum)?.color || ranked[0]?.color || null;
}

function firstReadableColor(colors, background, used, minimum = 4.5) {
  return uniqueDisplayColors(colors).find((color) => (
    !used.has(styleColorKey(color)) && styleColorContrast(color, background) >= minimum
  )) || null;
}

function readableRelationKeysForBackground(background) {
  return styleColorLuminance(background) < 0.36
    ? ['lighter', 'neutral', 'same', 'analogous', 'temperatureContrast', 'grayTone']
    : ['darker', 'neutral', 'grayTone', 'complementary', 'splitComplementary', 'triadic', 'temperatureContrast'];
}

function createStyleLabScheme(
  anchorImage = currentStyleAnchorImage,
  sceneKey = currentStyleSceneKey,
  intentKey = currentStyleIntentKey,
) {
  anchorImage ||= randomColorItems(1)[0] || images.find((image) => image.hex);
  if (!anchorImage) return null;

  const allColors = allDisplayColors();
  const anchor = displayColorFromImage(anchorImage);
  const harmony = harmonyForImage(anchorImage);
  const scene = styleLabScene(sceneKey);
  const intent = styleLabIntent(intentKey);
  const relationColors = styleLabRelationColors(harmony, scene, intent);
  const fallbackRelations = relationColors.length
    ? relationColors
    : relationDisplayColors(harmony, ['accent', 'complementary', 'analogous', 'same']);
  const used = new Set();

  const background = anchor;
  used.add(styleColorKey(background));

  const readableRelationKeys = readableRelationKeysForBackground(background);
  const coloredTextCandidates = styleColoredColors([
    ...fallbackRelations,
    ...relationDisplayColors(harmony, readableRelationKeys),
    ...relationDisplayColors(harmony, ['darker', 'lighter', 'neutral', 'grayTone', 'same']),
  ]);

  const titleCandidatePool = [
    ...coloredTextCandidates,
    ...relationDisplayColors(harmony, readableRelationKeys),
    ...relationColors,
    ...allColors,
  ];
  const title = firstReadableColor(titleCandidatePool, background, used, 4.5)
    || firstReadableColor(titleCandidatePool, background, used, 3)
    || bestContrastColor(titleCandidatePool, background, used, 0)
    || anchor;
  used.add(styleColorKey(title));

  const bodyCandidatePool = [
    ...relationDisplayColors(harmony, readableRelationKeys),
    ...styleColoredColors(fallbackRelations),
    ...relationDisplayColors(harmony, ['darker', 'neutral', 'grayTone']),
    ...allColors,
  ];
  const body = firstReadableColor(bodyCandidatePool, background, used, 4.5)
    || firstReadableColor(bodyCandidatePool, background, used, 3)
    || bestContrastColor(bodyCandidatePool, background, used, 0)
    || title;
  used.add(styleColorKey(body));

  const supportCandidates = [
    ...relationDisplayColors(harmony, intent.supportKeys),
    ...fallbackRelations,
    ...relationDisplayColors(harmony, scene.relationKeys),
    ...allColors,
  ];
  const support = firstUnusedColor(supportCandidates, used, (color) => styleColorContrast(color, background) >= 2.1)
    || bestContrastColor(supportCandidates, background, used, 0)
    || title;
  used.add(styleColorKey(support));

  const accentCandidates = [
    ...relationDisplayColors(harmony, intent.accentKeys),
    ...fallbackRelations,
    ...relationDisplayColors(harmony, ['accent', 'triadic', 'temperatureContrast']),
  ];
  const accent = firstUnusedColor(accentCandidates, used, (color) => styleColorContrast(color, background) >= 1.25)
    || firstUnusedColor(accentCandidates, used)
    || bestContrastColor([
      ...relationDisplayColors(harmony, ['accent', 'complementary', 'splitComplementary', 'triadic', 'temperatureContrast']),
      anchor,
      ...allColors,
    ], background, used, 2.1)
    || support;

  return {
    anchor,
    anchorImage,
    scene,
    intent,
    modeColors: fallbackRelations.slice(0, 4),
    actionText: styleColorContrast(background, support) >= styleColorContrast(title, support) ? background : title,
    roles: {
      background,
      title,
      body,
      support,
      accent,
    },
  };
}

function styleLabRoleLine(role, color) {
  return `${role.label}：${color.name} ${color.hex} / ${role.ratio} / ${role.use}`;
}

function styleLabSchemeText(scheme, roles = scheme.roles) {
  return STYLE_LAB_ROLES
    .map((role) => styleLabRoleLine(role, roles[role.key]))
    .join('\n');
}

function styleLabRoleByKey(roleKey) {
  return STYLE_LAB_ROLES.find((role) => role.key === roleKey) || null;
}

function styleLabRolesWithOverrides(scheme) {
  return {
    ...scheme.roles,
    ...currentStyleRoleOverrides,
  };
}

function styleLabActionTextForRoles(roles) {
  return styleColorContrast(roles.background, roles.support) >= styleColorContrast(roles.title, roles.support)
    ? roles.background
    : roles.title;
}

function applyStyleLabRoleOverrides(scheme) {
  const roles = styleLabRolesWithOverrides(scheme);

  return {
    ...scheme,
    roles,
    actionText: styleLabActionTextForRoles(roles),
  };
}

function styleLabSchemeForScene(sceneKey = currentStyleSceneKey) {
  let scheme = createStyleLabScheme(currentStyleAnchorImage, sceneKey, currentStyleIntentKey);
  if (!scheme) return null;

  if (Object.keys(currentStyleRoleOverrides).length) {
    scheme = applyStyleLabRoleOverrides(scheme);
  }

  return scheme;
}

function styleSceneCopyText(scene, scheme) {
  return [
    `场景：${scene.label}（${scene.scene}）`,
    `倾向：${scheme.intent.label}（${scheme.intent.intent}）`,
    `主色：${scheme.anchor.name} ${scheme.anchor.hex}`,
    `关系色：${styleLabRelationText(scheme)}`,
    `尺寸：${scene.size}`,
    `骨架：${scene.layout}`,
    '角色色：',
    styleLabSchemeText(scheme),
    `落位：${scene.structure}`,
    'CSS 变量：',
    styleLabCssVariables(scheme),
  ].join('\n');
}

function styleLabCopyText() {
  if (!currentStyleLabScheme) return '';

  return [
    '中国传统色配色方案',
    `主色：${currentStyleLabScheme.anchor.name} ${currentStyleLabScheme.anchor.hex}`,
    `场景：${currentStyleLabScheme.scene.label}`,
    `倾向：${currentStyleLabScheme.intent.label}`,
    `关系色：${styleLabRelationText(currentStyleLabScheme)}`,
    `标题对比：${styleLabContrastLabel(currentStyleLabScheme)}`,
    `使用逻辑：${currentStyleLabScheme.scene.structure}`,
    `面积建议：${STYLE_LAB_ROLES.map((role) => `${role.label}${role.ratio}`).join(' / ')}`,
    '',
    '角色色：',
    styleLabSchemeText(currentStyleLabScheme),
    '',
    `落位：${currentStyleLabScheme.scene.structure}`,
    `尺寸：${currentStyleLabScheme.scene.size}`,
    'CSS 变量：',
    styleLabCssVariables(currentStyleLabScheme),
  ].join('\n');
}

function styleLabRelationText(scheme) {
  return scheme.modeColors.length
    ? scheme.modeColors.map((color) => `${color.name} ${color.hex}`).join(' / ')
    : '无关系色，已用兜底色';
}

function styleLabContrastValue(scheme) {
  return styleColorContrast(scheme.roles.title, scheme.roles.background);
}

function styleLabContrastLabel(scheme) {
  return `${styleLabContrastValue(scheme).toFixed(1)}:1`;
}

function styleLabCssVariables(scheme, roles = scheme.roles) {
  const roleColor = (key) => roles[key];

  return [
    `--ctc-scene: ${scheme.scene.key}; /* ${scheme.scene.label} */`,
    `--ctc-intent: ${scheme.intent.key}; /* ${scheme.intent.label} */`,
    `--ctc-anchor: ${scheme.anchor.hex}; /* ${scheme.anchor.name} */`,
    `--ctc-bg: ${roleColor('background').hex}; /* ${roleColor('background').name} */`,
    `--ctc-title: ${roleColor('title').hex}; /* ${roleColor('title').name} */`,
    `--ctc-body: ${roleColor('body').hex}; /* ${roleColor('body').name} */`,
    `--ctc-button: ${roleColor('support').hex}; /* ${roleColor('support').name} */`,
    `--ctc-accent: ${roleColor('accent').hex}; /* ${roleColor('accent').name} */`,
  ].join('\n');
}

function styleLabReadinessMarkup(scheme) {
  const contrast = styleLabContrastValue(scheme);
  const contrastLabel = contrast >= 7 ? '正文也稳' : '适合大标题';

  return `
    <span>
      <strong>${escapeHtml(styleLabContrastLabel(scheme))}</strong>
      <small>${escapeHtml(contrastLabel)}</small>
    </span>
    <span>
      <strong>${escapeHtml(String(scheme.modeColors.length || 1))}</strong>
      <small>关系色</small>
    </span>
    <span>
      <strong>${escapeHtml(scheme.intent.label)}</strong>
      <small>${escapeHtml(scheme.scene.label)}</small>
    </span>
  `;
}

function renderStyleAnchor(scheme) {
  const harmony = harmonyForImage(scheme.anchorImage);
  const anchorValue = colorValue(scheme.anchor);
  const meta = [
    scheme.anchor.id,
    anchorValue,
    harmony?.hueFamily || harmony?.temperature,
  ].filter(Boolean).join(' · ');

  if (styleAnchor) styleAnchor.textContent = scheme.anchor.name;
  if (styleAnchorMeta) styleAnchorMeta.textContent = meta;
  if (styleAnchorSwatch) styleAnchorSwatch.style.setProperty('--anchor-color', scheme.anchor.hex);
  if (styleAnchorButton) {
    styleAnchorButton.style.setProperty('--anchor-color', scheme.anchor.hex);
    styleAnchorButton.setAttribute('aria-label', `切换当前中国色，当前为 ${scheme.anchor.name} ${anchorValue}`);
  }
  if (styleColorSearch) {
    styleColorSearch.value = '';
  }
  if (styleFormatSelect) {
    styleFormatSelect.value = selectedColorValueType;
  }
}

function styleLabSceneMarkup(scene) {
  const selected = scene.key === currentStyleSceneKey;

  return `
    <button class="style-mode-button" type="button" data-style-scene="${escapeHtml(scene.key)}" aria-pressed="${selected ? 'true' : 'false'}">
      <strong>${escapeHtml(scene.label)}</strong>
      <span>${escapeHtml(scene.short)}</span>
    </button>
  `;
}

function styleLabIntentMarkup(intent) {
  const selected = intent.key === currentStyleIntentKey;

  return `
    <button class="style-intent-button" type="button" data-style-intent="${escapeHtml(intent.key)}" aria-pressed="${selected ? 'true' : 'false'}">
      <strong>${escapeHtml(intent.label)}</strong>
    </button>
  `;
}

function renderStyleLabModes(scheme = currentStyleLabScheme) {
  if (styleSceneList) {
    styleSceneList.innerHTML = STYLE_LAB_SCENES.map(styleLabSceneMarkup).join('');
  }

  const scene = styleLabScene();
  const intent = styleLabIntent();
  if (styleSceneSummary) {
    styleSceneSummary.textContent = `${scene.label} · ${intent.label}`;
  }

  if (styleIntentList) {
    styleIntentList.innerHTML = STYLE_LAB_INTENTS.map(styleLabIntentMarkup).join('');
  }
}

function styleLabCanvasMarkup(scene, scheme) {
  if (scene.key === 'web') {
    return `
      <div class="style-sample-browserbar">
        <span></span><span></span><span></span>
        <b>Product</b>
        <i>Docs</i>
      </div>
      <div class="style-sample-web-hero">
        <div class="style-sample-web-copy">
          <span class="style-sample-overline">${escapeHtml(scene.overline)}</span>
          <h3>${escapeHtml(scene.title)}</h3>
          <p>${escapeHtml(scene.subtitle)}</p>
          <span class="style-sample-action">${escapeHtml(scene.action)}</span>
        </div>
        <div class="style-sample-web-visual" aria-hidden="true">
          <strong>${escapeHtml(scheme.anchor.name.slice(0, 1))}</strong>
          <span></span>
        </div>
      </div>
      <div class="style-sample-feature">
        <b>背景</b>
        <b>标题</b>
        <b>按钮</b>
      </div>
      <em>${escapeHtml(scene.meta)}</em>
    `;
  }

  if (scene.key === 'ppt') {
    return `
      <div class="style-sample-slide-top">
        <span>${escapeHtml(scene.overline)}</span>
        <b>16:9</b>
      </div>
      <div class="style-sample-slide-layout">
        <div>
          <h3>${escapeHtml(scene.title)}</h3>
          <p>${escapeHtml(scene.subtitle)}</p>
        </div>
        <div class="style-sample-slide-visual" aria-hidden="true">
          <strong>01</strong>
          <span></span>
        </div>
      </div>
      <div class="style-sample-slide-footer">
        <span>${escapeHtml(scene.meta)}</span>
        <b>06</b>
      </div>
    `;
  }

  if (scene.key === 'poster') {
    return `
      <span class="style-sample-overline">${escapeHtml(scene.overline)}</span>
      <strong class="style-sample-date">06.18</strong>
      <h3>${escapeHtml(scene.title)}</h3>
      <p>${escapeHtml(scene.subtitle)}</p>
      <div class="style-sample-poster-info">
        <span>线上直播</span>
        <span>20:00 开始</span>
      </div>
      <span class="style-sample-action">${escapeHtml(scene.action)}</span>
      <em>${escapeHtml(scene.meta)}</em>
    `;
  }

  if (scene.key === 'brand') {
    return `
      <div class="style-sample-brand-board">
        <div class="style-sample-brand-core">
          <span class="style-sample-overline">${escapeHtml(scene.overline)}</span>
          <div class="style-sample-brand-mark">${escapeHtml(scheme.anchor.name.slice(0, 1))}</div>
          <h3>${escapeHtml(scene.title)}</h3>
          <p>${escapeHtml(scene.subtitle)}</p>
        </div>
        <div class="style-sample-brand-system">
          <div class="style-sample-brand-strip">
            <span></span><span></span><span></span>
          </div>
          <dl>
            <div><dt>主色</dt><dd>识别</dd></div>
            <div><dt>辅助</dt><dd>物料</dd></div>
            <div><dt>点缀</dt><dd>行动</dd></div>
          </dl>
        </div>
      </div>
      <em>${escapeHtml(scene.meta)}</em>
    `;
  }

  if (scene.key === 'social') {
    return `
      <span class="style-sample-overline">${escapeHtml(scene.overline)}</span>
      <h3>${escapeHtml(scene.title)}</h3>
      <p>${escapeHtml(scene.subtitle)}</p>
      <div class="style-sample-social-footer">
        <small>${escapeHtml(scene.meta)}</small>
        <span>${escapeHtml(scene.action)}</span>
      </div>
      <em>${escapeHtml(scene.meta)}</em>
    `;
  }

  return `
    <span class="style-sample-overline">${escapeHtml(scene.overline)}</span>
    <h3>${escapeHtml(scene.title)}</h3>
    <p>${escapeHtml(scene.subtitle)}</p>
    <span class="style-sample-action">${escapeHtml(scene.action)}</span>
    <em>${escapeHtml(scene.meta)}</em>
  `;
}

function styleRoleSwatchMarkup(role, color) {
  const value = colorValue(color);
  const label = `${role.label} ${color.name} ${value}`;

  return `
    <button class="style-palette-role" type="button" data-style-role="${role.key}" aria-label="替换 ${escapeHtml(label)}" title="替换 ${escapeHtml(label)}">
      <span class="style-role-swatch" style="--style-role-color: ${escapeHtml(color.hex)}" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(role.label)} <b>${escapeHtml(role.ratio)}</b></strong>
        <small data-style-role-value>${escapeHtml(color.name)} ${escapeHtml(value)}</small>
        <em>${escapeHtml(role.use)}</em>
      </span>
    </button>
  `;
}

function styleTemplateMarkup(scene, scheme) {
  const roles = scheme.roles;
  const favoriteId = styleFavoriteId(scene, scheme);
  const favoriteActive = window.ZH_FAVORITES?.has(favoriteId);
  const selected = scene.key === currentStyleSceneKey;
  const customProperties = [
    `--sample-bg: ${roles.background.hex}`,
    `--sample-title: ${roles.title.hex}`,
    `--sample-body: ${roles.body.hex}`,
    `--sample-support: ${roles.support.hex}`,
    `--sample-accent: ${roles.accent.hex}`,
    `--sample-action-text: ${scheme.actionText.hex}`,
  ].join('; ');

  return `
    <article class="style-template-card style-template-card--scene style-template-card--${escapeHtml(scene.key)}" data-style-template-id="${escapeHtml(scene.key)}" data-active="${selected ? 'true' : 'false'}" aria-current="${selected ? 'true' : 'false'}" style="${escapeHtml(customProperties)}">
      <header class="style-template-meta">
        <span>${escapeHtml(scheme.intent.label)}</span>
        <strong>${escapeHtml(scene.label)}场景预览</strong>
        <button type="button" data-style-copy="${escapeHtml(scene.key)}" aria-label="复制 ${escapeHtml(scene.label)} 场景配色方案" title="复制 ${escapeHtml(scene.label)} 场景配色方案">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          <span class="sr-only">复制</span>
        </button>
        <button type="button" data-style-favorite="${escapeHtml(scene.key)}" aria-pressed="${favoriteActive ? 'true' : 'false'}" aria-label="${favoriteActive ? '取消收藏' : '收藏'} ${escapeHtml(scene.label)} 场景配色方案" title="${favoriteActive ? '取消收藏' : '收藏'}">
          <iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon>
          <span class="sr-only">收藏</span>
        </button>
      </header>
      <div class="style-template-canvas">
        ${styleLabCanvasMarkup(scene, scheme)}
      </div>
      <div class="style-template-brief">
        <p><strong>用在</strong><span>${escapeHtml(scene.scene)}</span></p>
        <p><strong>尺寸</strong><span>${escapeHtml(scene.size)}</span></p>
        <p><strong>骨架</strong><span>${escapeHtml(scene.layout)}</span></p>
        <p><strong>倾向</strong><span>${escapeHtml(scheme.intent.summary)}</span></p>
      </div>
    </article>
  `;
}

function setStyleLabStatus(message) {
  if (!styleStatus) return;

  styleStatus.textContent = message;
  styleStatus.dataset.visible = message ? 'true' : 'false';
}

function colorFavoriteItem(image) {
  const title = colorTitle(image);
  const value = colorValue(image);
  return {
    id: `color:${image.id}`,
    type: 'color',
    title,
    subtitle: `${image.id} · ${value}`,
    colors: [{ hex: image.hex }],
    href: 'index.html#gallery',
    text: `${title} ${value}`,
  };
}

function styleFavoriteId(scene, scheme = currentStyleLabScheme) {
  if (!scene || !scheme) return '';
  return `style:${scene.key}:${scheme.intent.key}:${STYLE_LAB_ROLES.map((role) => scheme.roles[role.key]?.hex || '').join('-')}`;
}

function styleFavoriteItem(scene, scheme = currentStyleLabScheme) {
  if (!scene) return null;
  if (!scheme || scheme.scene?.key !== scene.key) {
    scheme = styleLabSchemeForScene(scene.key);
  }
  if (!scheme) return null;

  const colors = STYLE_LAB_ROLES.map((role) => scheme.roles[role.key]).filter(Boolean);
  return {
    id: styleFavoriteId(scene, scheme),
    type: 'style',
    title: `${scene.label}场景 · ${scheme.intent.label}`,
    subtitle: `${scheme.anchor.name} 起稿 · ${colors.map((color) => color.name).join(' / ')}`,
    colors,
    href: 'style-lab.html',
    text: styleSceneCopyText(scene, scheme),
  };
}

function styleSchemeFavoriteId(scheme = currentStyleLabScheme) {
  if (!scheme) return '';
  return `style-scheme:${scheme.intent.key}:${STYLE_LAB_ROLES.map((role) => scheme.roles[role.key]?.hex || '').join('-')}`;
}

function styleSchemeFavoriteItem(scheme = currentStyleLabScheme) {
  const colors = STYLE_LAB_ROLES.map((role) => scheme.roles[role.key]).filter(Boolean);
  return {
    id: styleSchemeFavoriteId(scheme),
    type: 'style',
    title: `${scheme.scene.label}试色方案 · ${scheme.intent.label}`,
    subtitle: `${scheme.anchor.name} 起稿 · ${colors.map((color) => color.name).join(' / ')}`,
    colors,
    href: 'style-lab.html',
    text: styleLabCopyText(),
  };
}

function setStyleSchemeFavoriteFeedback(label, icon = 'lucide:check') {
  if (!styleSchemeFavoriteButton) return;

  window.clearTimeout(styleSchemeFavoriteButton._styleFavoriteTimer);
  const iconNode = styleSchemeFavoriteButton.querySelector('iconify-icon');
  iconNode?.setAttribute('icon', icon);
  if (styleSchemeFavoriteLabel) styleSchemeFavoriteLabel.textContent = label;
  styleSchemeFavoriteButton.dataset.feedback = 'true';
  styleSchemeFavoriteButton._styleFavoriteTimer = window.setTimeout(() => {
    delete styleSchemeFavoriteButton.dataset.feedback;
    updateStyleSchemeFavoriteButton();
  }, 1300);
}

function setColorFavoriteState(button, active, image) {
  if (!button || !image) return;

  window.clearTimeout(button._favoriteTimer);
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'} ${colorTitle(image)}`);
  button.title = active ? '取消收藏' : '收藏';
  button.dataset.feedback = 'true';
  button.querySelector('iconify-icon')?.setAttribute('icon', active ? 'lucide:check' : 'lucide:heart-off');
  const label = button.querySelector('.sr-only');
  if (label) label.textContent = active ? '已收藏' : '已取消';
  button._favoriteTimer = window.setTimeout(() => {
    delete button.dataset.feedback;
    button.querySelector('iconify-icon')?.setAttribute('icon', 'lucide:heart');
    if (label) label.textContent = active ? '已收藏' : '收藏';
  }, 1300);
}

function updateStyleSchemeFavoriteButton(scheme = currentStyleLabScheme) {
  if (!styleSchemeFavoriteButton || !window.ZH_FAVORITES || !scheme) return;
  const active = window.ZH_FAVORITES.has(styleSchemeFavoriteId(scheme));
  const iconNode = styleSchemeFavoriteButton.querySelector('iconify-icon');
  styleSchemeFavoriteButton.setAttribute('aria-pressed', String(active));
  styleSchemeFavoriteButton.setAttribute('aria-label', active ? '取消收藏当前试色方案' : '收藏当前试色方案');
  styleSchemeFavoriteButton.title = active ? '取消收藏当前试色方案' : '收藏当前试色方案';
  iconNode?.setAttribute('icon', 'lucide:heart');
  if (styleSchemeFavoriteLabel) styleSchemeFavoriteLabel.textContent = active ? '已收藏' : '收藏方案';
}

function setStyleTemplateFavoriteState(button, active, scene) {
  if (!button || !scene) return;

  window.clearTimeout(button._styleFavoriteTimer);
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'} ${scene.label} 场景配色方案`);
  button.title = active ? '取消收藏' : '收藏';
  button.dataset.feedback = 'true';
  button.innerHTML = `<iconify-icon icon="${active ? 'lucide:check' : 'lucide:heart-off'}" aria-hidden="true"></iconify-icon><span>${active ? '已收藏' : '已取消'}</span>`;
  button._styleFavoriteTimer = window.setTimeout(() => {
    delete button.dataset.feedback;
    button.innerHTML = `<iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon><span class="sr-only">收藏</span>`;
  }, 1300);
}

function renderStyleLab(statusMessage = '', options = {}) {
  if (!styleLab) return;

  if (options.newAnchor || !currentStyleAnchorImage) {
    if (!options.preserveOverrides) currentStyleRoleOverrides = {};
    currentStyleAnchorImage = randomColorItems(1)[0] || images.find((image) => image.hex);
  }

  const scheme = styleLabSchemeForScene(currentStyleSceneKey);
  if (!scheme) {
    styleLab.innerHTML = '<div class="empty-state"><strong>配色应用暂时无法生成</strong><span>没有读取到可用色值。</span></div>';
    return;
  }

  currentStyleLabScheme = scheme;
  currentStyleAnchorImage = scheme.anchorImage;
  renderStyleAnchor(scheme);
  if (stylePalette) {
    stylePalette.innerHTML = STYLE_LAB_ROLES
      .map((role) => styleRoleSwatchMarkup(role, scheme.roles[role.key]))
      .join('');
  }
  if (styleReadiness) {
    styleReadiness.innerHTML = styleLabReadinessMarkup(scheme);
  }
  renderStyleLabModes(scheme);
  styleLab.innerHTML = STYLE_LAB_SCENES
    .map((scene) => {
      const sceneScheme = styleLabSchemeForScene(scene.key);
      return sceneScheme ? styleTemplateMarkup(scene, sceneScheme) : '';
    })
    .join('');
  updateStyleSchemeFavoriteButton(scheme);
  setStyleLabStatus(statusMessage || `${scheme.anchor.name} · ${scheme.scene.label} · ${scheme.intent.label}`);
}

function applyStyleAnchor(image, statusMessage = '') {
  if (!image?.hex) return;

  currentStyleRoleOverrides = {};
  currentStyleAnchorImage = image;
  renderStyleLab(statusMessage || `已切换：${colorName(image)} ${colorValue(image)}`);
  if (styleColorSearch) styleColorSearch.value = colorName(image);
  if (styleColorDialog?.open) renderStyleColorPicker();
}

function commitStyleColorSearch() {
  if (!styleColorSearch) return;

  const image = findStyleColorImage(styleColorSearch.value);
  if (!image) {
    setStyleLabStatus('没找到颜色。换色名、编号或 HEX。');
    return;
  }

  applyStyleAnchor(image);
  styleColorSearch.blur();
}

function styleColorDialogModeText() {
  const role = styleLabRoleByKey(styleRoleReplacementKey);
  if (!role) {
    return {
      title: '选择一个中国色',
      note: '搜索或按色相筛选，点击色卡后会切换整套试色方案。',
      kicker: '切换主色',
      recommendationTitle: '推荐起点色',
      recommendationNote: '先从这些色相稳定的中国色开始。',
    };
  }

  return {
    title: `替换${role.label}`,
    note: `当前只替换“${role.label}”。点击推荐色或下方任意色卡都会立即应用。`,
    kicker: `正在替换：${role.label}`,
    recommendationTitle: `${role.label}推荐`,
    recommendationNote: `${role.use}，建议保持 ${role.ratio} 左右的面积。`,
  };
}

function styleRoleRecommendedColors(roleKey) {
  if (!currentStyleLabScheme) return [];

  const scheme = currentStyleLabScheme;
  const role = styleLabRoleByKey(roleKey);
  const harmony = harmonyForImage(scheme.anchorImage);
  const background = scheme.roles.background;
  const intent = scheme.intent;
  let candidates = [];

  if (!role) return [];

  if (roleKey === 'background') {
    candidates = [
      scheme.anchor,
      ...relationDisplayColors(harmony, ['same', 'analogous', 'lighter', 'neutral', 'grayTone']),
      ...allDisplayColors().filter((color) => styleColorLuminance(color) >= 0.72),
    ];
  } else if (roleKey === 'title') {
    candidates = [
      ...relationDisplayColors(harmony, readableRelationKeysForBackground(background)),
      ...relationDisplayColors(harmony, ['darker', 'complementary', 'splitComplementary', 'temperatureContrast']),
      ...allDisplayColors(),
    ].filter((color) => styleColorContrast(color, background) >= 4.5);
  } else if (roleKey === 'body') {
    candidates = [
      ...relationDisplayColors(harmony, ['darker', 'neutral', 'grayTone', 'same']),
      ...relationDisplayColors(harmony, readableRelationKeysForBackground(background)),
      ...allDisplayColors(),
    ].filter((color) => styleColorContrast(color, background) >= 4.5);
  } else if (roleKey === 'support') {
    candidates = [
      ...relationDisplayColors(harmony, intent.supportKeys),
      ...relationDisplayColors(harmony, ['complementary', 'splitComplementary', 'temperatureContrast', 'darker', 'lighter']),
      ...allDisplayColors(),
    ].filter((color) => styleColorContrast(color, background) >= 2.1);
  } else {
    candidates = [
      ...relationDisplayColors(harmony, intent.accentKeys),
      ...relationDisplayColors(harmony, ['accent', 'triadic', 'temperatureContrast', 'analogous']),
      ...allDisplayColors(),
    ].filter((color) => styleColorContrast(color, background) >= 1.25);
  }

  const currentKey = styleColorKey(scheme.roles[roleKey]);
  return uniqueDisplayColors(candidates)
    .filter((color) => styleColorKey(color) !== currentKey)
    .slice(0, 12);
}

function styleRecommendedColorKeys() {
  return new Set(styleRoleRecommendedColors(styleRoleReplacementKey).map(styleColorKey));
}

function styleColorDialogCurrentColor() {
  if (styleRoleReplacementKey && currentStyleLabScheme?.roles?.[styleRoleReplacementKey]) {
    return currentStyleLabScheme.roles[styleRoleReplacementKey];
  }
  return currentStyleLabScheme?.anchor || null;
}

function styleColorPickerItems() {
  const query = normalize(styleColorPickerSearch?.value || '');
  const recommendedKeys = styleRecommendedColorKeys();

  const items = images.filter((image) => {
    if (!image.hex) return false;

    const matchesHue = styleColorPickerHue === 'all' || hueFromHex(image.hex) === styleColorPickerHue;
    const matchesQuery = query ? colorQueryMatchesImage(image, query) : true;
    return matchesHue && matchesQuery;
  });

  if (!styleRoleReplacementKey || query || styleColorPickerHue !== 'all') return items;

  return [
    ...items.filter((image) => recommendedKeys.has(image.id)),
    ...items.filter((image) => !recommendedKeys.has(image.id)),
  ];
}

function styleColorPickerItemMarkup(image) {
  const selectedColor = styleColorDialogCurrentColor();
  const recommendedKeys = styleRecommendedColorKeys();
  const selected = selectedColor?.id === image.id || selectedColor?.hex === image.hex;
  const recommended = recommendedKeys.has(image.id);
  const harmony = harmonyForImage(image);
  const meta = [
    image.id,
    harmony?.hueFamily || hueFromHex(image.hex),
    colorValue(image),
  ].filter(Boolean).join(' · ');

  return `
    <button class="style-color-choice" type="button" data-style-color-choice="${escapeHtml(image.id)}" aria-current="${selected ? 'true' : 'false'}" data-recommended="${recommended ? 'true' : 'false'}" style="--choice-color: ${escapeHtml(image.hex)}" aria-label="选择 ${escapeHtml(colorName(image))} ${escapeHtml(colorValue(image))}">
      <span class="style-color-choice-swatch" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(colorName(image))}</strong>
        <small>${escapeHtml(meta)}</small>
      </span>
    </button>
  `;
}

function styleColorRecommendationMarkup(color) {
  return `
    <button class="style-recommendation" type="button" data-style-color-choice="${escapeHtml(color.id)}" style="--choice-color: ${escapeHtml(color.hex)}" aria-label="推荐 ${escapeHtml(color.name)} ${escapeHtml(color.hex)}">
      <span aria-hidden="true"></span>
      <strong>${escapeHtml(color.name)}</strong>
      <small>${escapeHtml(color.hex)}</small>
    </button>
  `;
}

function renderStyleColorRecommendations() {
  if (!styleColorRecommendations) return;

  const mode = styleColorDialogModeText();
  const items = styleRoleReplacementKey ? styleRoleRecommendedColors(styleRoleReplacementKey) : [];
  styleColorRecommendations.hidden = !styleRoleReplacementKey;
  styleColorRecommendations.innerHTML = items.length
    ? `
      <header>
        <strong>${escapeHtml(mode.recommendationTitle)}</strong>
        <span>${escapeHtml(mode.recommendationNote)}</span>
      </header>
      <div>${items.map(styleColorRecommendationMarkup).join('')}</div>
    `
    : '';
}

function renderStyleColorPicker() {
  if (!styleColorGrid) return;

  const items = styleColorPickerItems();
  const mode = styleColorDialogModeText();
  if (styleColorDialogKicker) styleColorDialogKicker.textContent = mode.kicker;
  if (styleColorDialogTitle) styleColorDialogTitle.textContent = mode.title;
  if (styleColorDialogNote) styleColorDialogNote.textContent = mode.note;
  renderStyleColorRecommendations();
  styleColorHueButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.styleColorHue === styleColorPickerHue));
  });

  styleColorGrid.innerHTML = items.length
    ? items.map(styleColorPickerItemMarkup).join('')
    : '<div class="style-color-empty"><strong>没有找到颜色</strong><span>换一个色相、编号、色名或 HEX 试试。</span></div>';

  if (styleColorDialogStatus) {
    const total = images.filter((image) => image.hex).length;
    styleColorDialogStatus.textContent = `${items.length.toLocaleString('zh-CN')} / ${total.toLocaleString('zh-CN')} 个传统色`;
  }
}

function openStyleColorPicker() {
  if (!styleColorDialog) return;

  styleRoleReplacementKey = '';
  renderStyleColorPicker();
  if (typeof styleColorDialog.showModal === 'function') {
    styleColorDialog.showModal();
    window.setTimeout(() => styleColorPickerSearch?.focus(), 60);
  }
}

function openStyleRoleColorPicker(roleKey) {
  if (!styleColorDialog || !styleLabRoleByKey(roleKey)) return;

  styleRoleReplacementKey = roleKey;
  styleColorPickerSearch.value = '';
  styleColorPickerHue = 'all';
  renderStyleColorPicker();
  if (typeof styleColorDialog.showModal === 'function') {
    styleColorDialog.showModal();
    window.setTimeout(() => styleColorPickerSearch?.focus(), 60);
  }
}

function applyStyleColorChoice(id, closeDialog = true) {
  const image = imagesById.get(id);
  if (!image?.hex) return;

  if (styleRoleReplacementKey) {
    const role = styleLabRoleByKey(styleRoleReplacementKey);
    const color = displayColorFromImage(image);
    if (!role || !color) return;

    currentStyleRoleOverrides = {
      ...currentStyleRoleOverrides,
      [styleRoleReplacementKey]: color,
    };
    renderStyleLab(`已替换${role.label}：${color.name} ${colorValue(color)}`, { preserveOverrides: true });
    renderStyleColorPicker();
    if (closeDialog) styleColorDialog?.close();
    return;
  }

  currentStyleRoleOverrides = {};
  applyStyleAnchor(image, `已切换：${colorName(image)} ${colorValue(image)}`);
  renderStyleColorPicker();
  if (closeDialog) styleColorDialog?.close();
}

async function copyStyleTemplate(sceneKey) {
  const scene = STYLE_LAB_SCENES.find((item) => item.key === sceneKey) || currentStyleLabScheme?.scene;
  const scheme = styleLabSchemeForScene(scene?.key) || currentStyleLabScheme;
  if (!scene || !scheme) return;

  await writeClipboard(styleSceneCopyText(scene, scheme));
  setStyleLabStatus(`已复制：${scene.label}方案`);
  return scene;
}

function setStyleTemplateCopyState(button, scene) {
  if (!button || !scene) return;

  window.clearTimeout(button._styleCopyTimer);
  button.dataset.copied = 'true';
  button.setAttribute('aria-label', `已复制 ${scene.label} 场景配色方案`);
  button.innerHTML = '<iconify-icon icon="lucide:check" aria-hidden="true"></iconify-icon><span>已复制</span>';
  button._styleCopyTimer = window.setTimeout(() => {
    delete button.dataset.copied;
    button.setAttribute('aria-label', `复制 ${scene.label} 场景配色方案`);
    button.innerHTML = '<iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon><span class="sr-only">复制</span>';
  }, 1400);
}

async function copyStyleRole(roleKey) {
  const role = STYLE_LAB_ROLES.find((item) => item.key === roleKey);
  const color = currentStyleLabScheme?.roles[roleKey];
  if (!role || !color) return;

  const copyText = `${role.label}：${color.name} ${colorValue(color)}`;
  await writeClipboard(copyText);
  setStyleLabStatus(`已复制：${copyText}`);
}

async function copyStyleAnchor() {
  if (!currentStyleLabScheme?.anchor) return;

  const copyText = `主色：${currentStyleLabScheme.anchor.name} ${colorValue(currentStyleLabScheme.anchor)}`;
  await writeClipboard(copyText);
  setStyleLabStatus(`已复制：${copyText}`);
}

async function copyStyleDialogCurrentColor() {
  if (styleRoleReplacementKey) {
    const role = styleLabRoleByKey(styleRoleReplacementKey);
    const color = currentStyleLabScheme?.roles?.[styleRoleReplacementKey];
    if (!role || !color) return;

    const copyText = `${role.label}：${color.name} ${colorValue(color)}`;
    await writeClipboard(copyText);
    setStyleLabStatus(`已复制：${copyText}`);
    return;
  }

  copyStyleAnchor();
}

async function copyStyleCssVariables() {
  if (!currentStyleLabScheme) return;

  await writeClipboard(styleLabCssVariables(currentStyleLabScheme));
  setStyleLabStatus('已复制 CSS 变量');
}

async function copyStyleTemplateColor(roleKey) {
  const role = STYLE_LAB_ROLES.find((item) => item.key === roleKey);
  const color = currentStyleLabScheme?.roles[roleKey];
  if (!role || !color) return;

  const copyText = `${role.label}：${color.name} ${colorValue(color)}`;
  await writeClipboard(copyText);
  setStyleLabStatus(`已复制预览色值：${copyText}`);
}

function usePreviewColorInStyleLab() {
  if (!currentHeroPreviewImage) return;

  heroPreviewDialog?.close();
  window.location.href = `style-lab.html?color=${encodeURIComponent(currentHeroPreviewImage.id)}`;
}

function lookupDisplayColor(color) {
  if (typeof color === 'string') {
    const image = imagesById.get(color);
    return {
      id: color,
      name: image ? colorName(image) : '',
      hex: image?.hex || '',
    };
  }

  const image = imagesById.get(color?.id);
  return {
    id: color?.id || image?.id || '',
    name: color?.name || (image ? colorName(image) : ''),
    hex: color?.hex || image?.hex || '',
  };
}

function harmonyForImage(image) {
  return image ? colorHarmonies[image.id] : null;
}

function harmonyRelationType(key) {
  return HARMONY_RELATION_TYPES.find((type) => type.key === key) || HARMONY_RELATION_TYPES[0];
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

function harmonyAnchorRole(relation) {
  const roles = {
    same: '整套视觉的母色或系列识别色',
    analogous: '主视觉气质色，关系色负责柔和过渡',
    complementary: '主要识别色，互补色只放在必须被看见的位置',
    splitComplementary: '稳定主色，分裂互补色承担辅助强调和视觉装饰',
    triadic: '系列母色，其他三角色分配给栏目、章节或分类',
    tetradic: '复杂系统的主色，其他色先分配为辅色、状态色和结构色',
    temperatureContrast: '情绪基准色，另一侧色温负责制造对照',
    lighter: '识别色或标题色，明色关系色优先做背景和留白',
    darker: '气质来源色，暗色关系色优先做标题、正文和边界',
    grayTone: '识别色，灰调关系色负责降低噪声和承托信息',
    neutral: '主视觉色，中性色负责结构、留白和阅读秩序',
  };

  return roles[relation.key] || '主色';
}

function harmonyAnchorUseText(image, harmony, relation, colors) {
  const hsl = harmony?.hsl || {};
  const colorNames = colors
    .slice(0, 3)
    .map(lookupDisplayColor)
    .filter((color) => color.name)
    .map((color) => `${color.name} ${color.hex}`)
    .join(' / ');
  const tone = [
    harmony?.hueFamily,
    harmony?.temperature,
    Number.isFinite(hsl.l) ? lightnessLabel(hsl.l) : '',
    Number.isFinite(hsl.s) ? saturationLabel(hsl.s) : '',
  ].filter(Boolean).join('、');

  return [
    `${colorName(image)}：${tone || '传统色'}。`,
    `可作${harmonyAnchorRole(relation)}。`,
    colorNames ? `可试 ${colorNames}。先小面积。` : '关系色不足，先配中性色。',
  ].join('');
}

function harmonyRelationColors(harmony, relation) {
  return harmony?.[relation.key] || [];
}

function previewRoleLabel(harmony, relation) {
  const hsl = harmony?.hsl || {};

  if (['complementary', 'splitComplementary'].includes(relation.key)) {
    return '主色负责识别，关系色只放重点';
  }
  if (relation.key === 'triadic') {
    return '主色定气质，关系色分栏目';
  }
  if (relation.key === 'tetradic') {
    return '先分用途，再上色';
  }
  if (relation.key === 'grayTone') {
    return '主色保记忆，灰调降噪';
  }
  if (relation.key === 'neutral') {
    return '主色表达，中性色托底';
  }
  if (relation.key === 'lighter' || hsl.l >= 84) {
    return '优先做背景，正文另配深色';
  }
  if (relation.key === 'darker' || hsl.l <= 28) {
    return '优先做标题、正文或深底';
  }
  if (relation.key === 'analogous') {
    return '主色定气质，邻近色过渡';
  }
  if (hsl.s >= 72) {
    return '适合识别或小面积重点';
  }

  return harmonyAnchorRole(relation);
}

function previewReadabilityText(harmony, relation) {
  const hsl = harmony?.hsl || {};

  if (hsl.l >= 82) return '小字慎用，正文配深色。';
  if (hsl.l <= 28) return '适合压重，正文配明色。';
  if (hsl.s >= 72) return '高饱和少铺满，先测对比。';
  if (relation.key === 'grayTone' || relation.key === 'neutral') return '适合密集信息，用明暗分层。';
  if (['complementary', 'splitComplementary'].includes(relation.key)) return '关系色越强，面积越小。';

  return '先测标题、正文、按钮对比。';
}

function compactText(value, limit = 34) {
  const text = String(value || '').trim();
  if (text.length <= limit) return text;
  const firstClause = text.split(/[。；;]/).find(Boolean) || text;
  if (firstClause.length <= limit) return `${firstClause}。`;
  return `${firstClause.slice(0, limit)}…`;
}

function previewRelationButtonMarkup(color, relation, index) {
  const item = lookupDisplayColor(color);
  if (!item.id || !item.hex) return '';

  const value = colorValue(item);
  const usageLabel = `${relation.label} ${index + 1}`;
  const label = `${item.id}-${item.name}`;

  return `
    <button class="preview-guide-color" type="button" data-harmony-color="${escapeHtml(item.id)}" data-harmony-name="${escapeHtml(item.name)}" data-harmony-hex="${escapeHtml(item.hex)}" data-harmony-use="${escapeHtml(usageLabel)}" style="--swatch: ${escapeHtml(item.hex)}" aria-label="复制 ${escapeHtml(usageLabel)} ${escapeHtml(label)} ${colorValueLabel()} 色值 ${escapeHtml(value)}">
      <span class="preview-guide-color-swatch" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(item.name)}</strong>
        <small data-harmony-value>${escapeHtml(value)}</small>
      </span>
    </button>
  `;
}

function renderHeroPreviewGuide(image, harmony) {
  if (!heroPreviewGuide) return;
  if (!image || !harmony) {
    heroPreviewGuide.hidden = true;
    heroPreviewGuide.innerHTML = '';
    heroPreviewGuide.removeAttribute('style');
    return;
  }

  const relation = harmonyRelationType(currentHarmonyKey);
  const relationColors = harmonyRelationColors(harmony, relation)
    .map(lookupDisplayColor)
    .filter((color) => color.id && color.hex)
    .slice(0, 3);
  const firstRelation = relationColors[0]?.hex || image.hex || '#777777';
  const imageValue = colorValue(image);
  const imageLabel = `${image.id}-${colorName(image)}`;

  heroPreviewGuide.hidden = false;
  heroPreviewGuide.setAttribute('style', `--guide-anchor: ${image.hex || '#777777'}; --guide-relation: ${firstRelation};`);
  heroPreviewGuide.innerHTML = `
    <div class="preview-guide-head">
      <span>实用规范</span>
      <strong>${escapeHtml(relation.intent || relation.label)} / ${escapeHtml(relation.label)}</strong>
    </div>
    <button class="preview-guide-anchor" type="button" data-harmony-color="${escapeHtml(image.id)}" data-harmony-name="${escapeHtml(colorName(image))}" data-harmony-hex="${escapeHtml(image.hex || '')}" data-harmony-use="主色" style="--swatch: ${escapeHtml(image.hex || '#777777')}" aria-label="复制主色 ${escapeHtml(imageLabel)} ${colorValueLabel()} 色值 ${escapeHtml(imageValue)}">
      <span class="preview-guide-anchor-swatch" aria-hidden="true"></span>
      <span>
        <b>${escapeHtml(imageLabel)}</b>
        <small data-harmony-value>${escapeHtml(imageValue)}</small>
      </span>
    </button>
    <dl class="preview-guide-rules">
      <div>
        <dt>角色</dt>
        <dd>${escapeHtml(previewRoleLabel(harmony, relation))}</dd>
      </div>
      <div>
        <dt>面积</dt>
        <dd>${escapeHtml(compactText(relation.area || '先小面积验证，再扩大使用。'))}</dd>
      </div>
      <div>
        <dt>可读</dt>
        <dd>${escapeHtml(previewReadabilityText(harmony, relation))}</dd>
      </div>
    </dl>
    <div class="preview-guide-related" aria-label="${escapeHtml(relation.label)}关系色">
      ${relationColors.length
        ? relationColors.map((color, index) => previewRelationButtonMarkup(color, relation, index)).join('')
        : '<span>关系色不足，先配中性色。</span>'}
    </div>
  `;
}

function harmonyColorMarkup(color, usageLabel = '') {
  const item = lookupDisplayColor(color);
  const label = `${item.id}-${item.name}`;
  const value = colorValue(item);
  const usageText = usageLabel || '点击复制';
  const ariaUsage = usageLabel ? `${usageLabel} ` : '';

  return `
    <button class="harmony-color" type="button" data-harmony-color="${escapeHtml(item.id)}" data-harmony-name="${escapeHtml(item.name)}" data-harmony-hex="${escapeHtml(item.hex)}" data-harmony-use="${escapeHtml(usageLabel)}" style="--swatch: ${item.hex}" aria-label="复制 ${escapeHtml(ariaUsage)}${escapeHtml(label)} ${colorValueLabel()} 色值 ${escapeHtml(value)}">
      <span class="harmony-color-swatch" aria-hidden="true"></span>
      <span class="harmony-color-copy">
        <em>${escapeHtml(usageText)}</em>
        <strong>${escapeHtml(label)}</strong>
        <small data-harmony-value>${escapeHtml(value)}</small>
      </span>
    </button>
  `;
}

function mainHarmonyColor(image) {
  return {
    id: image.id,
    name: colorName(image),
    hex: image.hex,
  };
}

function harmonyRoleColors(role, image, harmony) {
  if (role.key === 'main') return [mainHarmonyColor(image)];
  return harmony[role.key] || [];
}

function harmonyRoleMarkup(role, image, harmony) {
  const colors = harmonyRoleColors(role, image, harmony);
  return `
    <section class="harmony-role">
      <header>
        <span>${role.context}</span>
        <small>${role.hint}</small>
      </header>
      <div class="harmony-role-colors">
        ${colors.map((color) => harmonyColorMarkup(color, role.label)).join('')}
      </div>
    </section>
  `;
}

function renderHarmonyRoles(image, harmony) {
  if (!heroPreviewRoleMap || !harmony) return;

  heroPreviewRoleMap.innerHTML = HARMONY_ROLE_TYPES
    .map((role) => harmonyRoleMarkup(role, image, harmony))
    .join('');
}

function harmonyTabMarkup(type) {
  return `
    <button class="harmony-tab" type="button" role="tab" data-harmony-key="${type.key}" aria-selected="${type.key === currentHarmonyKey ? 'true' : 'false'}">
      <strong>${type.intent}</strong>
      <span>${type.label}</span>
    </button>
  `;
}

function renderHarmonyTabs(harmony) {
  if (!harmonyTabs || !harmony) return;

  const availableTypes = HARMONY_RELATION_TYPES.filter((type) => harmony[type.key]?.length);
  if (!availableTypes.some((type) => type.key === currentHarmonyKey)) {
    currentHarmonyKey = availableTypes[0]?.key || 'same';
  }

  harmonyTabs.innerHTML = availableTypes.map(harmonyTabMarkup).join('');
}

function harmonyPanelCopyMarkup(relation, image, harmony, colors) {
  return `
    <div class="harmony-panel-copy">
      <div>
        <strong>${relation.intent}</strong>
        <span>${relation.label}</span>
      </div>
      <p><b>适合</b>${escapeHtml(compactText(relation.direction || ''))}</p>
    </div>
    <div class="harmony-use-grid">
      <section>
        <strong>场景</strong>
        <p>${escapeHtml(compactText(relation.scenarios || ''))}</p>
      </section>
      <section>
        <strong>面积</strong>
        <p>${escapeHtml(compactText(relation.area || ''))}</p>
      </section>
      <section>
        <strong>当前色</strong>
        <p>${escapeHtml(harmonyAnchorUseText(image, harmony, relation, colors))}</p>
      </section>
      <section>
        <strong>风险</strong>
        <p>${escapeHtml(compactText(relation.risk || ''))}</p>
      </section>
    </div>
  `;
}

function renderHarmonyPanel(harmony, image = currentHeroPreviewImage) {
  if (!harmonyPanel || !harmony) return;

  const relation = harmonyRelationType(currentHarmonyKey);
  const colors = harmony[currentHarmonyKey] || [];
  harmonyPanel.innerHTML = `
    ${harmonyPanelCopyMarkup(relation, image, harmony, colors)}
    <div class="harmony-color-grid">
      ${colors.map((color) => harmonyColorMarkup(color)).join('')}
    </div>
  `;
}

function renderHeroPreviewHarmony(image) {
  const harmony = harmonyForImage(image);
  if (!harmony) {
    if (heroPreviewHue) heroPreviewHue.textContent = '未记录';
    if (heroPreviewHarmony) heroPreviewHarmony.hidden = true;
    renderHeroPreviewGuide(image, harmony);
    return;
  }

  if (heroPreviewHue) {
    heroPreviewHue.textContent = `${harmony.hueFamily} · ${harmony.temperature} · H${harmony.hsl.h} S${harmony.hsl.s} L${harmony.hsl.l}`;
  }
  if (heroPreviewHarmony) heroPreviewHarmony.hidden = false;
  if (heroPreviewHarmonyNote) {
    heroPreviewHarmonyNote.textContent = HARMONY_USAGE_NOTE;
  }

  renderHarmonyRoles(image, harmony);
  renderHarmonyTabs(harmony);
  renderHarmonyPanel(harmony, image);
  renderHeroPreviewGuide(image, harmony);
}

function harmonyColorFromButton(button) {
  return lookupDisplayColor({
    id: button.dataset.harmonyColor,
    name: button.dataset.harmonyName,
    hex: button.dataset.harmonyHex,
  });
}

function updateHarmonyValues() {
  document.querySelectorAll('[data-harmony-color]').forEach((button) => {
    const color = harmonyColorFromButton(button);
    const value = colorValue(color);
    const label = `${color.id}-${color.name}`;
    const usage = button.dataset.harmonyUse ? `${button.dataset.harmonyUse} ` : '';
    const valueNode = button.querySelector('[data-harmony-value]');
    if (valueNode && !button.dataset.copied) valueNode.textContent = value;
    button.setAttribute('aria-label', `复制 ${usage}${label} ${colorValueLabel()} 色值 ${value}`);
  });
}

async function copyHarmonyColor(button) {
  const color = harmonyColorFromButton(button);
  const value = colorValue(color);
  const copyText = `${color.name} ${value}`;

  await writeClipboard(copyText);
  button.dataset.copied = 'true';
  setTemporaryLabel(button.querySelector('[data-harmony-value]'), '已复制');
  if (heroPreviewStatus) {
    heroPreviewStatus.textContent = `已复制 ${colorValueLabel()}：${copyText}`;
  }
  window.setTimeout(() => {
    delete button.dataset.copied;
    updateHarmonyValues();
  }, 1200);
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function titleContextText(title) {
  const section = title.closest('section, header, footer, main, article');
  return [
    title.id,
    title.textContent,
    section?.id,
    section?.className,
    title.closest('[aria-labelledby]')?.getAttribute('aria-labelledby'),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function titlePreferredHues(title) {
  const context = titleContextText(title);
  const tone = TITLE_TONE_MAP.find((item) => item.match.some((keyword) => context.includes(keyword)));
  return tone?.hues || ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
}

function scoredTitleColors(title) {
  const background = hoverBackgroundRgb(title) || nearestBackgroundRgb(title);
  const targetIsDark = relativeLuminance(background) < 0.22;
  const preferredHues = titlePreferredHues(title);

  return images
    .filter((image) => image.hex)
    .map((image) => {
      const rgb = rgbFromHex(image.hex);
      if (!rgb) return null;

      const ratio = contrastRatio(rgb, background);
      const hue = hueFromHex(image.hex);
      const hsl = hslFromRgb(rgb);
      const hueIndex = preferredHues.indexOf(hue);
      const hueScore = hueIndex === -1 ? 0 : 80 - (hueIndex * 12);
      const contrastScore = Math.min(ratio, 12) * 10;
      const saturationScore = hue === 'neutral'
        ? (targetIsDark ? -18 : 3)
        : Math.min(hsl.s, 76) / (targetIsDark ? 2.4 : 3);
      const lightnessTarget = targetIsDark ? 72 : 34;
      const lightnessBalance = 100 - Math.abs(hsl.l - lightnessTarget);
      const blackSurfacePenalty = targetIsDark && hsl.l < 54 ? -120 : 0;
      const washedOutPenalty = !targetIsDark && hsl.l > 58 ? -42 : 0;

      return {
        image,
        hue,
        ratio,
        score: hueScore + contrastScore + saturationScore + (lightnessBalance / 4) + blackSurfacePenalty + washedOutPenalty,
      };
    })
    .filter(Boolean)
    .filter((item) => item.ratio >= (targetIsDark ? 5.6 : 4.5))
    .sort((first, second) => second.score - first.score);
}

function titleColorPalette(title) {
  const preferredHues = titlePreferredHues(title);
  const scored = scoredTitleColors(title);
  const semantic = scored.filter((item) => preferredHues.includes(item.hue));
  const source = semantic.length >= 4 ? semantic : scored;
  const seed = hashString(`${titleContextText(title)} ${currentTheme()}`);
  const palette = [];
  const used = new Set();

  for (let offset = 0; offset < source.length && palette.length < 5; offset += 1) {
    const item = source[(seed + (offset * 17)) % source.length];
    if (!item || used.has(item.image.hex)) continue;
    used.add(item.image.hex);
    palette.push(item.image);
  }

  return palette;
}

function activateTitleColor(title) {
  title.dataset.titleText = title.textContent.trim();
  const palette = titleColorPalette(title);
  if (!palette.length) return;

  const previousIndex = Number.parseInt(title.dataset.titleHoverIndex || '-1', 10);
  const nextIndex = Number.isNaN(previousIndex) ? 0 : (previousIndex + 1) % palette.length;
  const color = palette[nextIndex];
  const baseColor = window.getComputedStyle(title).color;

  title.dataset.titleHoverIndex = String(nextIndex);
  title.style.setProperty('--title-base-color', baseColor);
  title.style.setProperty('--title-hover-color', color.hex);
  title.dataset.titleHoverColor = `${colorName(color)} ${color.hex}`;
  title.classList.add('title-color-active');
}

function clearTitleColor(title) {
  title.classList.remove('title-color-active');
}

function bindTitleColorHover() {
  if (gradientLogicDisabled) return;

  titleHoverElements.forEach((title) => {
    const titleText = title.textContent.trim();
    title.dataset.titleText = titleText;
    title.setAttribute('aria-label', titleText);
    title.addEventListener('pointerenter', () => activateTitleColor(title));
    title.addEventListener('pointerleave', () => clearTitleColor(title));
    title.addEventListener('focus', () => activateTitleColor(title));
    title.addEventListener('blur', () => clearTitleColor(title));
  });
}

function buildFooterSpectrum() {
  if (!footerColorButtons.length) return;

  const colors = randomColorItems(footerColorButtons.length);
  footerColorButtons.forEach((button, index) => {
    const image = colors[index];
    if (!image) return;

    const name = colorName(image);
    const hex = image.hex;
    const copyText = `${name} ${hex}`;
    button.style.setProperty('--spectrum-color', hex);
    button.style.setProperty('--spectrum-index', String(randomInt(9) + 1));
    button.dataset.footerCopyValue = copyText;
    button.title = `复制 ${copyText}`;
    button.setAttribute('aria-label', `复制 ${name} 色值 ${hex}`);
  });
}

function headerOffset() {
  return (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + 12;
}

function maxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function scrollPositions() {
  const offset = headerOffset();
  const positions = [0];
  document.querySelectorAll('main > section, .site-footer').forEach((section) => {
    const top = Math.max(0, Math.round(section.getBoundingClientRect().top + window.scrollY - offset));
    positions.push(top);
  });

  positions.push(maxScrollY());
  return [...new Set(positions)].sort((a, b) => a - b);
}

function scrollBySection(direction) {
  const current = window.scrollY;
  const threshold = 48;
  const positions = scrollPositions();
  const next = direction === 'up'
    ? [...positions].reverse().find((position) => position < current - threshold)
    : positions.find((position) => position > current + threshold);
  const target = next ?? (direction === 'up' ? 0 : maxScrollY());

  window.scrollTo({
    top: Math.min(target, maxScrollY()),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}

function updateScrollControls() {
  const current = window.scrollY;
  const max = maxScrollY();
  if (scrollUpButton) scrollUpButton.disabled = current <= 8;
  if (scrollDownButton) scrollDownButton.disabled = current >= max - 8;
}

function setSkillOpen(item, open) {
  if (!item) return;

  item.dataset.open = open ? 'true' : 'false';
  const button = item.querySelector('[data-skill-toggle]');
  const label = item.querySelector('[data-skill-toggle-label]');
  const detail = item.querySelector('.skill-detail');

  button?.setAttribute('aria-expanded', String(open));
  if (label) label.textContent = open ? '收起说明' : '展开说明';
  detail?.setAttribute('aria-hidden', String(!open));
}

function closeSkillItems(except) {
  document.querySelectorAll('.skill-item[data-open="true"]').forEach((item) => {
    if (item !== except) setSkillOpen(item, false);
  });
}

function scrollToSkillItem(item) {
  window.requestAnimationFrame(() => {
    const top = Math.max(0, item.getBoundingClientRect().top + window.scrollY - headerOffset());
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    item.focus({ preventScroll: true });
  });
}

function openSkillFromHash() {
  if (!window.location.hash.startsWith('#skill-')) {
    if (window.location.hash === '#skills') closeSkillItems();
    return;
  }

  const item = document.querySelector(window.location.hash);
  if (!item?.classList.contains('skill-item')) return;

  closeSkillItems(item);
  setSkillOpen(item, true);
  scrollToSkillItem(item);
}

function queueScrollControlsUpdate() {
  if (scrollControlFrame) return;

  scrollControlFrame = window.requestAnimationFrame(() => {
    scrollControlFrame = 0;
    updateScrollControls();
  });
}

function buildHero() {
  if (!heroMosaic) return;

  const featured = Array.from({ length: 20 }, (_, index) => {
    const sourceIndex = Math.round(index * ((images.length - 1) / 19));
    return images[sourceIndex];
  }).filter(Boolean);

  const columns = Array.from({ length: 4 }, () => []);
  featured.forEach((image, index) => {
    columns[index % columns.length].push(image);
  });

  const imageMarkup = (image) => (
    `<button class="hero-film-card" type="button" data-hero-preview="${image.id}" aria-label="查看 ${colorTitle(image)} 色卡信息">
      <img src="${encodedPath(thumbnailPath(image))}" alt="中国传统色色卡 ${colorTitle(image)}" loading="eager">
    </button>`
  );

  heroMosaic.innerHTML = columns.map((column, columnIndex) => (
    `<div class="film-strip" style="--strip-index: ${columnIndex}">
      <div class="film-track">
        ${column.map(imageMarkup).join('')}
        ${column.map(imageMarkup).join('')}
      </div>
    </div>`
  )).join('');
}

function syncHeroPreviewDialogHeight() {
  if (!heroPreviewDialog?.open || !heroPreviewMedia || !heroPreviewImage) return;

  if (!window.matchMedia('(min-width: 1041px)').matches) {
    heroPreviewDialog.style.removeProperty('--preview-dialog-height');
    return;
  }

  const mediaWidth = heroPreviewMedia.getBoundingClientRect().width;
  const naturalWidth = heroPreviewImage.naturalWidth || 1086;
  const naturalHeight = heroPreviewImage.naturalHeight || 1448;
  if (!mediaWidth || !naturalWidth || !naturalHeight) return;

  const imageHeight = mediaWidth * (naturalHeight / naturalWidth);
  const maxHeight = Math.min(window.innerHeight * 0.9, 880);
  const dialogHeight = Math.min(imageHeight, maxHeight);
  heroPreviewDialog.style.setProperty('--preview-dialog-height', `${Math.round(dialogHeight)}px`);
}

function queueHeroPreviewDialogHeightSync() {
  if (heroPreviewResizeFrame) return;

  heroPreviewResizeFrame = window.requestAnimationFrame(() => {
    heroPreviewResizeFrame = 0;
    syncHeroPreviewDialogHeight();
  });
}

function openHeroPreview(id) {
  const image = images.find((item) => item.id === id);
  if (!image || !heroPreviewDialog) return;

  const url = encodedPath(image.path);
  currentHeroPreviewImage = image;
  if (heroPreviewImage) {
    heroPreviewImage.src = url;
    heroPreviewImage.alt = `中国传统色色卡 ${colorTitle(image)}`;
  }
  if (heroPreviewTitle) heroPreviewTitle.textContent = colorTitle(image);
  if (heroPreviewHex) heroPreviewHex.textContent = image.hex || '未记录';
  if (heroPreviewFile) heroPreviewFile.textContent = image.file;
  if (heroPreviewSize) heroPreviewSize.textContent = formatBytes(image.size);
  if (heroPreviewFormat) heroPreviewFormat.value = selectedColorValueType;
  renderHeroPreviewHarmony(image);
  if (heroPreviewDownload) {
    heroPreviewDownload.href = url;
    heroPreviewDownload.setAttribute('download', image.file);
  }
  if (heroPreviewStatus) heroPreviewStatus.textContent = `当前复制格式：${colorValueLabel()}`;
  if (heroPreviewContent) heroPreviewContent.scrollTop = 0;
  heroPreviewDialog.scrollTop = 0;

  if (typeof heroPreviewDialog.showModal === 'function') {
    heroPreviewDialog.showModal();
    queueHeroPreviewDialogHeightSync();
  }
}

function cardMarkup(image) {
  const url = encodedPath(image.path);
  const thumbnailUrl = encodedPath(thumbnailPath(image));
  const title = colorTitle(image);
  const hex = image.hex || '';
  const displayTitle = hex ? `${title} · ${hex}` : title;
  const copyValue = colorValue(image);
  const favoriteItem = colorFavoriteItem(image);
  const favoriteActive = window.ZH_FAVORITES?.has(favoriteItem.id);
  const formatOptions = COLOR_VALUE_TYPES.map((type) => (
    `<option value="${type.value}"${type.value === selectedColorValueType ? ' selected' : ''}>${type.label}</option>`
  )).join('');

  return `
    <article class="color-card">
      <div class="card-media">
        <button class="card-image-link" type="button" data-open-color-preview="${image.id}" aria-label="查看 ${title} 色卡详情">
          <img src="${thumbnailUrl}" alt="中国传统色色卡 ${title}" loading="lazy">
        </button>
        ${hex ? `<div class="copy-color-control">
          <button class="copy-color-button" type="button" data-copy-color="${image.id}" aria-label="复制 ${colorName(image)} ${colorValueLabel()} 色值 ${copyValue}">复制 <span data-copy-value>${copyValue}</span></button>
          <label class="copy-format">
            <span class="sr-only">选择复制色值类型</span>
            <select data-copy-format aria-label="复制色值类型">
              ${formatOptions}
            </select>
          </label>
        </div>` : ''}
      </div>
      <div class="card-meta">
        <span>
          <strong>${displayTitle}</strong>
          <small>原图 ${formatBytes(image.size)}</small>
        </span>
        <span class="card-actions">
          <button class="card-button" type="button" data-open-color-preview="${image.id}" aria-label="查看 ${title} 配色关系">
            <iconify-icon icon="lucide:palette" aria-hidden="true"></iconify-icon>
          </button>
          <button class="card-button" type="button" data-favorite-color="${image.id}" aria-pressed="${favoriteActive ? 'true' : 'false'}" aria-label="${favoriteActive ? '取消收藏' : '收藏'} ${title}">
            <iconify-icon icon="lucide:heart" aria-hidden="true"></iconify-icon>
            <span class="sr-only">${favoriteActive ? '已收藏' : '收藏'}</span>
          </button>
          <a class="card-button" href="${url}" download aria-label="下载 ${title}">
            <iconify-icon icon="lucide:download" aria-hidden="true"></iconify-icon>
          </a>
        </span>
      </div>
    </article>
  `;
}

function syncGalleryFooter(visibleLength) {
  if (galleryStatus) {
    galleryStatus.textContent = `已显示 ${visibleLength.toLocaleString('zh-CN')} / ${currentItems.length.toLocaleString('zh-CN')} 张`;
  }

  if (loadMoreButton) {
    loadMoreButton.hidden = visibleLength >= currentItems.length;
  }

  setupAutoLoad();
  queueScrollControlsUpdate();
}

function setupAutoLoad() {
  galleryAutoObserver?.disconnect();
  galleryAutoObserver = undefined;
}

function renderGallery() {
  if (!gallery) return;

  const visible = currentItems.slice(0, visibleCount);
  gallery.innerHTML = visible.length
    ? visible.map(cardMarkup).join('')
    : '<div class="empty-state"><strong>没有找到对应色卡</strong><span>换一个色名、编号、色值或色相试试，例如「黛」「001」「#F9F4DC」</span></div>';

  syncGalleryFooter(visible.length);
}

function appendGalleryItems(count) {
  if (!gallery) return;

  const currentVisible = Math.min(visibleCount, currentItems.length);
  const nextVisible = Math.min(currentVisible + count, currentItems.length);
  if (nextVisible <= currentVisible) {
    syncGalleryFooter(currentVisible);
    return;
  }

  const nextItems = currentItems.slice(currentVisible, nextVisible);
  visibleCount = nextVisible;
  gallery.insertAdjacentHTML('beforeend', nextItems.map(cardMarkup).join(''));
  syncGalleryFooter(nextVisible);
}

function applySearch() {
  applyFilters();
}

function initializeGallery() {
  const query = normalize(searchInput?.value || '');
  if (!query && hueFilter) {
    hueFilter.value = randomGalleryHue();
  }

  applyFilters();
}

function applyFilters() {
  const query = normalize(searchInput?.value || '');
  currentHue = hueFilter?.value || 'all';
  const filteredItems = images.filter((image) => {
    const matchesQuery = query ? colorQueryMatchesImage(image, query) : true;
    const matchesHue = currentHue === 'all' ? true : hueFromHex(image.hex) === currentHue;
    return matchesQuery && matchesHue;
  });
  currentItems = randomizeImageOrder(filteredItems);
  visibleCount = GALLERY_PAGE_SIZE;
  shuffled = true;
  renderGallery();
}

function shuffleItems() {
  currentItems = randomizeImageOrder(currentItems);
  visibleCount = GALLERY_PAGE_SIZE;
  shuffled = true;
  renderGallery();
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const input = document.createElement('input');
    input.value = text;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
}

function setTemporaryLabel(node, label, duration = 1200) {
  if (!node) return;

  const original = node.textContent;
  node.textContent = label;
  node.dataset.copied = 'true';
  window.setTimeout(() => {
    node.textContent = original;
    delete node.dataset.copied;
  }, duration);
}

async function copyHex(button) {
  const image = images.find((item) => item.id === button.dataset.copyColor);
  if (!image) return;

  await writeClipboard(colorValue(image));
  button.textContent = '已复制';
  button.dataset.copied = 'true';
  window.setTimeout(() => {
    const value = colorValue(image);
    button.innerHTML = `复制 <span data-copy-value>${value}</span>`;
    delete button.dataset.copied;
  }, 1200);
}

function updateCopyControls() {
  document.querySelectorAll('[data-copy-format]').forEach((select) => {
    select.value = selectedColorValueType;
  });
  if (styleFormatSelect) {
    styleFormatSelect.value = selectedColorValueType;
  }

  document.querySelectorAll('[data-copy-color]').forEach((button) => {
    const image = images.find((item) => item.id === button.dataset.copyColor);
    if (!image) return;

    const value = colorValue(image);
    const valueNode = button.querySelector('[data-copy-value]');
    if (valueNode) valueNode.textContent = value;
    button.setAttribute('aria-label', `复制 ${colorName(image)} ${colorValueLabel()} 色值 ${value}`);
    if (!button.dataset.copied) {
      button.innerHTML = `复制 <span data-copy-value>${value}</span>`;
    }
  });

  updateHarmonyValues();
  renderStyleColorPicker();
  if (currentStyleLabScheme) {
    renderStyleAnchor(currentStyleLabScheme);
    if (stylePalette) {
      stylePalette.innerHTML = STYLE_LAB_ROLES
        .map((role) => styleRoleSwatchMarkup(role, currentStyleLabScheme.roles[role.key]))
        .join('');
    }
    renderStyleLabModes(currentStyleLabScheme);
    if (styleLab) {
      styleLab.innerHTML = styleTemplateMarkup(currentStyleLabScheme.scene, currentStyleLabScheme);
    }
  }
}

function masterListText() {
  return images.map((image) => `${colorName(image)} ${image.hex || ''}`.trim()).join('\n');
}

function masterListItems() {
  const query = normalize(masterSearchInput?.value || '');
  if (!query) return images;

  return images.filter((image) => {
    return colorQueryMatchesImage(image, query);
  });
}

function renderMasterList() {
  if (!masterColorList) return;

  const items = masterListItems();
  masterColorList.innerHTML = items.length ? items.map((image) => {
    const name = colorName(image);
    const hex = image.hex || '';
    const copyText = `${name} ${hex}`.trim();

    return `
      <button class="master-color-row" type="button" data-copy-color="${copyText}" aria-label="复制 ${copyText}">
        <span class="master-id">${image.id}</span>
        <span class="master-swatch" style="--swatch: ${hex || '#999999'}"></span>
        <span class="master-name">${name}</span>
        <span class="master-hex">${hex}</span>
      </button>
    `;
  }).join('') : '<div class="master-empty"><strong>没有找到颜色</strong><span>换一个编号、色名或 HEX 试试。</span></div>';

  if (masterListStatus) {
    masterListStatus.textContent = `${items.length.toLocaleString('zh-CN')} / ${images.length.toLocaleString('zh-CN')} 个颜色`;
  }
}

function openMasterList() {
  if (!masterListDialog) return;

  renderMasterList();

  if (typeof masterListDialog.showModal === 'function') {
    masterListDialog.showModal();
    window.setTimeout(() => masterSearchInput?.focus(), 60);
  }
}

function buildCrcTable() {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value >>> 0;
  }

  return table;
}

const CRC_TABLE = buildCrcTable();

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function dosDateTime(date) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosDate, dosTime };
}

function writeUInt16(target, offset, value) {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
}

function writeUInt32(target, offset, value) {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
  target[offset + 2] = (value >>> 16) & 0xff;
  target[offset + 3] = (value >>> 24) & 0xff;
}

function zipLocalHeader(entry) {
  const header = new Uint8Array(30 + entry.name.length);
  const { dosDate, dosTime } = dosDateTime(new Date());

  writeUInt32(header, 0, 0x04034b50);
  writeUInt16(header, 4, 20);
  writeUInt16(header, 6, 0x0800);
  writeUInt16(header, 8, 0);
  writeUInt16(header, 10, dosTime);
  writeUInt16(header, 12, dosDate);
  writeUInt32(header, 14, entry.crc);
  writeUInt32(header, 18, entry.size);
  writeUInt32(header, 22, entry.size);
  writeUInt16(header, 26, entry.name.length);
  writeUInt16(header, 28, 0);
  header.set(entry.name, 30);

  return header;
}

function zipCentralHeader(entry) {
  const header = new Uint8Array(46 + entry.name.length);
  const { dosDate, dosTime } = dosDateTime(new Date());

  writeUInt32(header, 0, 0x02014b50);
  writeUInt16(header, 4, 20);
  writeUInt16(header, 6, 20);
  writeUInt16(header, 8, 0x0800);
  writeUInt16(header, 10, 0);
  writeUInt16(header, 12, dosTime);
  writeUInt16(header, 14, dosDate);
  writeUInt32(header, 16, entry.crc);
  writeUInt32(header, 20, entry.size);
  writeUInt32(header, 24, entry.size);
  writeUInt16(header, 28, entry.name.length);
  writeUInt16(header, 30, 0);
  writeUInt16(header, 32, 0);
  writeUInt16(header, 34, 0);
  writeUInt16(header, 36, 0);
  writeUInt32(header, 38, 0);
  writeUInt32(header, 42, entry.offset);
  header.set(entry.name, 46);

  return header;
}

function zipEndRecord(count, centralSize, centralOffset) {
  const header = new Uint8Array(22);

  writeUInt32(header, 0, 0x06054b50);
  writeUInt16(header, 4, 0);
  writeUInt16(header, 6, 0);
  writeUInt16(header, 8, count);
  writeUInt16(header, 10, count);
  writeUInt32(header, 12, centralSize);
  writeUInt32(header, 16, centralOffset);
  writeUInt16(header, 20, 0);

  return header;
}

function setDownloadProgress(done, total, label) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (zipStatus) zipStatus.textContent = `${label} ${done.toLocaleString('zh-CN')} / ${total.toLocaleString('zh-CN')} (${percent}%)`;
}

async function downloadZip() {
  if (!images.length || !zipButton) return;

  zipButton.disabled = true;
  zipButton.textContent = '备用打包中';
  setDownloadProgress(0, images.length, '读取图片');

  try {
    const encoder = new TextEncoder();
    const parts = [];
    const centralEntries = [];
    let offset = 0;

    for (const [index, image] of images.entries()) {
      const response = await fetch(encodedPath(image.path));
      if (!response.ok) {
        throw new Error(`读取失败：${image.path}`);
      }

      const data = new Uint8Array(await response.arrayBuffer());
      const entry = {
        name: encoder.encode(image.path),
        size: data.byteLength,
        crc: crc32(data),
        offset,
      };
      const header = zipLocalHeader(entry);
      parts.push(header, data);
      offset += header.byteLength + data.byteLength;
      centralEntries.push(entry);
      setDownloadProgress(index + 1, images.length, '读取图片');
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const centralOffset = offset;
    let centralSize = 0;

    for (const entry of centralEntries) {
      const central = zipCentralHeader(entry);
      parts.push(central);
      centralSize += central.byteLength;
      offset += central.byteLength;
    }

    parts.push(zipEndRecord(centralEntries.length, centralSize, centralOffset));

    const blob = new Blob(parts, { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = project.archiveName;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    if (zipStatus) {
      zipStatus.textContent = `${project.archiveName} 已生成，大小约 ${formatBytes(blob.size)}。`;
    }
  } catch (error) {
    if (zipStatus) {
      zipStatus.textContent = `${error.message}。备用打包需要通过本地服务器或 GitHub Pages 打开页面。`;
    }
  } finally {
    zipButton.disabled = false;
    zipButton.innerHTML = '<iconify-icon icon="lucide:package" aria-hidden="true"></iconify-icon>浏览器备用打包';
  }
}

updateStats();
setTheme(currentTheme());
buildHero();
buildFooterSpectrum();
renderStyleColorOptions();
renderStyleLab();
renderStyleColorPicker();
initializeGallery();
updateScrollControls();
skillToggleButtons.forEach((button) => {
  setSkillOpen(button.closest('.skill-item'), false);
});
bindTitleColorHover();

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
searchInput?.addEventListener('input', debounce(applySearch, 200));
hueFilter?.addEventListener('change', applyFilters);
shuffleButton?.addEventListener('click', shuffleItems);
loadMoreButton?.addEventListener('click', () => {
  appendGalleryItems(GALLERY_PAGE_SIZE);
});
styleRefreshButton?.addEventListener('click', () => {
  renderStyleLab(`已换主色：${styleLabScene().label} · ${styleLabIntent().label}`, { newAnchor: true });
  renderStyleColorPicker();
});
styleAnchorButton?.addEventListener('click', openStyleColorPicker);
styleColorSearch?.addEventListener('change', commitStyleColorSearch);
styleColorSearch?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;

  event.preventDefault();
  commitStyleColorSearch();
});
styleFormatSelect?.addEventListener('change', () => {
  saveColorValueType(styleFormatSelect.value);
  updateCopyControls();
  setStyleLabStatus(`复制格式：${colorValueLabel()}`);
});
styleColorPickerSearch?.addEventListener('input', debounce(renderStyleColorPicker, 200));
styleColorHueButtons.forEach((button) => {
  button.addEventListener('click', () => {
    styleColorPickerHue = button.dataset.styleColorHue || 'all';
    renderStyleColorPicker();
  });
});
styleColorGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-style-color-choice]');
  if (!button) return;

  applyStyleColorChoice(button.dataset.styleColorChoice);
});
styleColorRecommendations?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-style-color-choice]');
  if (!button) return;

  applyStyleColorChoice(button.dataset.styleColorChoice);
});
closeStyleColorButton?.addEventListener('click', () => styleColorDialog?.close());
styleColorDialog?.addEventListener('click', (event) => {
  if (event.target === styleColorDialog) styleColorDialog.close();
});
styleColorRandomButton?.addEventListener('click', () => {
  const recommended = styleRoleReplacementKey
    ? styleRoleRecommendedColors(styleRoleReplacementKey)
      .map((color) => imagesById.get(color.id))
      .filter(Boolean)
    : [];
  const items = styleColorPickerItems();
  const pool = recommended.length ? recommended : (items.length ? items : images.filter((image) => image.hex));
  const image = pool[randomInt(pool.length)];
  if (!image) return;

  applyStyleColorChoice(image.id, false);
});
styleColorCopyCurrentButton?.addEventListener('click', copyStyleDialogCurrentColor);
styleCopyAllButton?.addEventListener('click', async () => {
  const copyText = styleLabCopyText();
  if (!copyText) return;

  await writeClipboard(copyText);
  setStyleLabStatus('已复制整组方案');
});
styleCopyCssButton?.addEventListener('click', copyStyleCssVariables);
styleSchemeFavoriteButton?.addEventListener('click', () => {
  if (!currentStyleLabScheme || !window.ZH_FAVORITES) return;
  const result = window.ZH_FAVORITES.toggle(styleSchemeFavoriteItem(currentStyleLabScheme));
  updateStyleSchemeFavoriteButton(currentStyleLabScheme);
  setStyleSchemeFavoriteFeedback(result.active ? '已收藏' : '已取消', result.active ? 'lucide:check' : 'lucide:heart-off');
  setStyleLabStatus(result.active ? '已收藏当前试色方案' : '已取消收藏当前试色方案');
});
styleSceneList?.addEventListener('click', (event) => {
  const sceneButton = event.target.closest('[data-style-scene]');
  if (!sceneButton) return;

  currentStyleSceneKey = sceneButton.dataset.styleScene;
  renderStyleLab(`场景：${styleLabScene().label}`);
});
styleIntentList?.addEventListener('click', (event) => {
  const intentButton = event.target.closest('[data-style-intent]');
  if (!intentButton) return;

  currentStyleIntentKey = intentButton.dataset.styleIntent;
  renderStyleLab(`倾向：${styleLabIntent().label}`);
});
stylePalette?.addEventListener('click', (event) => {
  const roleButton = event.target.closest('[data-style-role]');
  if (roleButton) openStyleRoleColorPicker(roleButton.dataset.styleRole);
});
styleLab?.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-style-copy]');
  if (copyButton) {
    copyStyleTemplate(copyButton.dataset.styleCopy).then((scene) => {
      setStyleTemplateCopyState(copyButton, scene);
    });
    return;
  }

  const favoriteButton = event.target.closest('[data-style-favorite]');
  if (favoriteButton) {
    const scene = STYLE_LAB_SCENES.find((item) => item.key === favoriteButton.dataset.styleFavorite);
    if (!scene || !currentStyleLabScheme || !window.ZH_FAVORITES) return;
    const item = styleFavoriteItem(scene);
    if (!item) return;
    const result = window.ZH_FAVORITES.toggle(item);
    setStyleTemplateFavoriteState(favoriteButton, result.active, scene);
    setStyleLabStatus(result.active ? `已收藏：${scene.label}场景` : `已取消收藏：${scene.label}场景`);
    return;
  }

  const sceneCard = event.target.closest('[data-style-template-id]');
  if (sceneCard && sceneCard.dataset.styleTemplateId !== currentStyleSceneKey) {
    currentStyleSceneKey = sceneCard.dataset.styleTemplateId;
    renderStyleLab(`场景：${styleLabScene().label}`);
  }
});

gallery?.addEventListener('click', (event) => {
  const previewButton = event.target.closest('[data-open-color-preview]');
  if (previewButton) {
    openHeroPreview(previewButton.dataset.openColorPreview);
    return;
  }

  const copyButton = event.target.closest('[data-copy-color]');
  if (copyButton) {
    copyHex(copyButton);
    return;
  }

  const favoriteButton = event.target.closest('[data-favorite-color]');
  if (favoriteButton) {
    const image = images.find((item) => item.id === favoriteButton.dataset.favoriteColor);
    if (!image || !window.ZH_FAVORITES) return;
    const result = window.ZH_FAVORITES.toggle(colorFavoriteItem(image));
    setColorFavoriteState(favoriteButton, result.active, image);
    if (galleryStatus) galleryStatus.textContent = result.active ? `已收藏：${colorTitle(image)}` : `已取消收藏：${colorTitle(image)}`;
  }
});
gallery?.addEventListener('change', (event) => {
  const select = event.target.closest('[data-copy-format]');
  if (!select) return;

  saveColorValueType(select.value);
  updateCopyControls();
});
heroMosaic?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-hero-preview]');
  if (button) openHeroPreview(button.dataset.heroPreview);
});

openMasterListButtons.forEach((button) => {
  button.addEventListener('click', openMasterList);
});
closeMasterListButton?.addEventListener('click', () => masterListDialog?.close());
closeHeroPreviewButton?.addEventListener('click', () => heroPreviewDialog?.close());
heroPreviewImage?.addEventListener('load', queueHeroPreviewDialogHeightSync);
heroPreviewDialog?.addEventListener('close', () => {
  heroPreviewDialog.style.removeProperty('--preview-dialog-height');
});
heroPreviewDialog?.addEventListener('click', (event) => {
  if (event.target === heroPreviewDialog) heroPreviewDialog.close();
});
heroPreviewHarmony?.addEventListener('click', (event) => {
  const tab = event.target.closest('[data-harmony-key]');
  if (tab) {
    currentHarmonyKey = tab.dataset.harmonyKey;
    const harmony = harmonyForImage(currentHeroPreviewImage);
    renderHarmonyTabs(harmony);
    renderHarmonyPanel(harmony, currentHeroPreviewImage);
    renderHeroPreviewGuide(currentHeroPreviewImage, harmony);
    return;
  }

  const harmonyButton = event.target.closest('[data-harmony-color]');
  if (harmonyButton) {
    copyHarmonyColor(harmonyButton);
  }
});
heroPreviewGuide?.addEventListener('click', (event) => {
  const harmonyButton = event.target.closest('[data-harmony-color]');
  if (harmonyButton) copyHarmonyColor(harmonyButton);
});
copyHeroPreviewButton?.addEventListener('click', async () => {
  if (!currentHeroPreviewImage?.hex) return;

  const copyText = `${colorName(currentHeroPreviewImage)} ${colorValue(currentHeroPreviewImage)}`;
  await writeClipboard(copyText);
  if (heroPreviewStatus) {
    heroPreviewStatus.textContent = `已复制 ${colorValueLabel()}：${copyText}`;
  }
});
usePreviewColorButton?.addEventListener('click', usePreviewColorInStyleLab);
heroPreviewFormat?.addEventListener('change', () => {
  saveColorValueType(heroPreviewFormat.value);
  updateCopyControls();
  if (currentHeroPreviewImage && heroPreviewStatus) {
    heroPreviewStatus.textContent = `已切换为 ${colorValueLabel()}，下一次复制会沿用该格式`;
  }
});
masterSearchInput?.addEventListener('input', debounce(renderMasterList, 200));
masterListDialog?.addEventListener('click', async (event) => {
  if (event.target === masterListDialog) {
    masterListDialog.close();
    return;
  }

  const colorButton = event.target.closest('[data-copy-color]');
  if (colorButton) {
    await writeClipboard(colorButton.dataset.copyColor);
    setTemporaryLabel(colorButton.querySelector('.master-hex'), '已复制');
  }
});
copyMasterListButton?.addEventListener('click', async () => {
  await writeClipboard(masterListText());
  if (masterListStatus) {
    setTemporaryLabel(masterListStatus, '已复制完整清单', 1600);
  }
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
skillToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.skill-item');
    const shouldOpen = item?.dataset.open !== 'true';
    if (shouldOpen) closeSkillItems(item);
    setSkillOpen(item, shouldOpen);
  });
});
skillAnchorLinks.forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(openSkillFromHash, 0);
  });
});
scrollUpButton?.addEventListener('click', () => scrollBySection('up'));
scrollDownButton?.addEventListener('click', () => scrollBySection('down'));
window.addEventListener('scroll', queueScrollControlsUpdate, { passive: true });
window.addEventListener('resize', () => {
  queueScrollControlsUpdate();
  queueMobileNavState();
  queueHeroPreviewDialogHeightSync();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});
window.addEventListener('hashchange', openSkillFromHash);
openSkillFromHash();
zipButton?.addEventListener('click', downloadZip);
