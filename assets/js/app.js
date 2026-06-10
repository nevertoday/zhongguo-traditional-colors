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
const styleStatus = document.querySelector('[data-style-status]');
const styleAnchor = document.querySelector('[data-style-anchor]');
const stylePalette = document.querySelector('[data-style-palette]');
const styleReadiness = document.querySelector('[data-style-readiness]');
const styleModeList = document.querySelector('[data-style-mode-list]');
const styleModeSummary = document.querySelector('[data-style-mode-summary]');
const styleModeColors = document.querySelector('[data-style-mode-colors]');
const styleColorSearch = document.querySelector('[data-style-color-search]');
const styleColorOptions = document.querySelector('[data-style-color-options]');
const styleAnchorMeta = document.querySelector('[data-style-anchor-meta]');
const styleAnchorSwatch = document.querySelector('[data-style-anchor-swatch]');
const styleAnchorCopyButton = document.querySelector('[data-style-anchor-copy]');
const styleFormatSelect = document.querySelector('[data-style-format]');
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

let visibleCount = 24;
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

const TITLE_TONE_MAP = [
  { match: ['hero', 'top'], hues: ['red', 'orange', 'yellow'] },
  { match: ['gallery', '色卡', '图库', '筛选'], hues: ['blue', 'cyan', 'green'] },
  { match: ['style', '样式', '封面', '排版'], hues: ['red', 'orange', 'blue', 'green'] },
  { match: ['audit', '清单', '索引', '覆盖'], hues: ['blue', 'green', 'neutral'] },
  { match: ['knowledge', '知识', '提示', '秩序'], hues: ['yellow', 'green', 'blue'] },
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

const HARMONY_USAGE_NOTE = '先看使用场景，再点击色块复制色值；格式会跟随上方选择。';

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

const STYLE_LAB_ROLES = [
  { key: 'background', label: '背景色', use: '铺底和留白', ratio: '大面积' },
  { key: 'title', label: '标题色', use: '主标题和核心文字', ratio: '标题' },
  { key: 'body', label: '正文色', use: '说明、日期和弱信息', ratio: '正文' },
  { key: 'support', label: '主色', use: '品牌、主视觉和系列识别', ratio: '主色' },
  { key: 'accent', label: '关系色', use: '由所选配色逻辑推导', ratio: '强调' },
];

const STYLE_LAB_MODES = [
  {
    key: 'same',
    label: '同类',
    intent: '统一',
    relationKeys: ['same'],
    summary: '适合整套内容保持统一气质，风险最低。',
  },
  {
    key: 'analogous',
    label: '邻近',
    intent: '柔和',
    relationKeys: ['analogous'],
    summary: '适合需要有变化但不跳脱的封面和系列图。',
  },
  {
    key: 'complementary',
    label: '互补',
    intent: '强调',
    relationKeys: ['complementary'],
    summary: '适合标题、按钮、价格、日期等需要被看见的位置。',
  },
  {
    key: 'splitComplementary',
    label: '分裂互补',
    intent: '稳对比',
    relationKeys: ['splitComplementary'],
    summary: '适合既要对比，又不希望画面过于生硬的内容。',
  },
  {
    key: 'triadic',
    label: '三角',
    intent: '系列',
    relationKeys: ['triadic'],
    summary: '适合多张封面、活动系列、栏目包装和多色主题。',
  },
  {
    key: 'tetradic',
    label: '四角',
    intent: '多层级',
    relationKeys: ['tetradic'],
    summary: '适合信息层级较多的海报、课程和专题页。',
  },
  {
    key: 'temperatureContrast',
    label: '冷暖',
    intent: '情绪差',
    relationKeys: ['temperatureContrast'],
    summary: '适合制造冷暖情绪对照，比如温暖主体配冷静信息。',
  },
  {
    key: 'lightDark',
    label: '明暗',
    intent: '层次',
    relationKeys: ['lighter', 'darker'],
    summary: '适合先解决背景、标题和可读性，再做少量点缀。',
  },
  {
    key: 'grayTone',
    label: '灰调',
    intent: '降噪',
    relationKeys: ['grayTone'],
    summary: '适合长文、课件、资料型内容，降低颜色噪声。',
  },
  {
    key: 'neutral',
    label: '中性',
    intent: '留白',
    relationKeys: ['neutral'],
    summary: '适合背景、边界、版式结构和克制的品牌表达。',
  },
];

const STYLE_LAB_TEMPLATES = [
  {
    id: 'title-cover',
    label: '标题封面',
    scene: '公众号首图、作品集封面、系列开篇',
    size: '3:4 / 1080x1440',
    layout: '大标题 / 短副标题 / 底部信息',
    structure: '大标题靠左，短副标题承接，底部信息行收口，点缀色只做细线和角标。',
    overline: 'TRADITIONAL COLOR',
    title: '春山如黛',
    subtitle: '给一组内容先定气质',
    meta: '视觉练习 / 传统色',
  },
  {
    id: 'quote-card',
    label: '诗句短卡',
    scene: '摘录卡、诗词短句、社交媒体配图',
    size: '4:5 / 1080x1350',
    layout: '短句居中 / 注释下沉 / 大留白',
    structure: '短句居中偏上，译注或出处放在低权重位置，用大留白让颜色和文字一起呼吸。',
    overline: 'NOTE',
    title: '风过庭前，花影不语',
    subtitle: '留白适合短句、诗词和摘录',
    meta: '中式短卡',
  },
  {
    id: 'course-cover',
    label: '课程封面',
    scene: '线上课程、知识付费封面、课件首页',
    size: '16:9 / 1920x1080',
    layout: '课程名 / 模块条 / 讲次信息',
    structure: '课程名做主视觉，编号和模块列表形成秩序，点缀色用于学习进度和重点提示。',
    overline: 'COURSE 03',
    title: '东方色彩课',
    subtitle: '从色名到版面秩序',
    meta: '配色 / 字体 / 留白',
  },
  {
    id: 'event-poster',
    label: '活动海报',
    scene: '公开课、沙龙、直播预告、展览活动',
    size: '9:16 / 1080x1920',
    layout: '日期 / 活动名 / 行动信息',
    structure: '活动名和时间形成强主次，辅助信息沿边缘排布，点缀色负责行动入口。',
    overline: 'ONLINE TALK',
    title: '色彩公开课',
    subtitle: '传统色在现代内容里的用法',
    meta: '06.18 / 20:00',
  },
  {
    id: 'column-header',
    label: '栏目头图',
    scene: '专栏封面、网站头图、视频栏目包装',
    size: '2:1 / 1600x800',
    layout: '栏目名 / 期数 / 固定署名',
    structure: '栏目名稳定出现，期数和短说明建立连续性，适合做一整套内容资产。',
    overline: 'ISSUE 24',
    title: '中国色札记',
    subtitle: '一周一个色彩主题',
    meta: '小小东整理',
  },
];

let currentStyleLabScheme;
let currentStyleAnchorImage;
let currentStyleLabModeKey = 'complementary';

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
  const hoverSurface = title.closest('.knowledge-note, .open-primary, .open-step');
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

  return images.find((image) => image.hex && styleColorSearchText(image).includes(query)) || null;
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

function styleLabMode(key = currentStyleLabModeKey) {
  return STYLE_LAB_MODES.find((mode) => mode.key === key) || STYLE_LAB_MODES[0];
}

function styleLabRelationColors(harmony, mode = styleLabMode()) {
  return relationDisplayColors(harmony, mode.relationKeys);
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

function createStyleLabScheme(anchorImage = currentStyleAnchorImage, modeKey = currentStyleLabModeKey) {
  anchorImage ||= randomColorItems(1)[0] || images.find((image) => image.hex);
  if (!anchorImage) return null;

  const allColors = allDisplayColors();
  const anchor = displayColorFromImage(anchorImage);
  const harmony = harmonyForImage(anchorImage);
  const mode = styleLabMode(modeKey);
  const modeColors = styleLabRelationColors(harmony, mode);
  const relationColors = modeColors.length
    ? modeColors
    : relationDisplayColors(harmony, ['accent', 'complementary', 'analogous', 'same']);
  const used = new Set([styleColorKey(anchor)]);

  const backgroundCandidates = [
    ...relationDisplayColors(harmony, ['lighter', 'neutral', 'grayTone', 'same']),
    ...sortedStyleColors(allColors, 'light'),
  ];
  const background = firstUnusedColor(
    sortedStyleColors(backgroundCandidates, 'light'),
    used,
    (color) => styleColorLuminance(color) >= 0.58,
  ) || sortedStyleColors(backgroundCandidates, 'light')[0] || anchor;
  used.add(styleColorKey(background));

  const coloredTextCandidates = styleColoredColors([
    ...relationColors,
    ...relationDisplayColors(harmony, ['darker', 'complementary', 'splitComplementary', 'triadic', 'temperatureContrast']),
    ...allColors,
  ]);

  const title = bestContrastColor(coloredTextCandidates, background, used, 4.5) || bestContrastColor([
    ...relationDisplayColors(harmony, ['darker', 'neutral', 'grayTone', 'complementary']),
    ...sortedStyleColors(allColors, 'dark'),
  ], background, used, 4.5) || anchor;
  used.add(styleColorKey(title));

  const body = bestContrastColor([
    ...styleColoredColors([
      ...relationDisplayColors(harmony, ['darker', 'grayTone', 'neutral', 'same']),
      ...relationColors,
    ]),
    ...relationDisplayColors(harmony, ['darker', 'neutral', 'grayTone']),
    ...sortedStyleColors(allColors, 'dark'),
  ], background, used, 3) || title;
  used.add(styleColorKey(body));

  const support = anchor;

  const accent = firstUnusedColor(relationColors, used, (color) => styleColorContrast(color, background) >= 1.25)
    || firstUnusedColor(relationColors, used)
    || bestContrastColor([
      ...relationDisplayColors(harmony, ['accent', 'complementary', 'splitComplementary', 'triadic', 'temperatureContrast']),
      anchor,
      ...allColors,
    ], background, used, 2.1)
    || support;

  return {
    anchor,
    anchorImage,
    mode,
    modeColors: relationColors.slice(0, 4),
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
  return `${role.label}：${color.name} ${color.hex}（建议 ${role.ratio}，${role.use}）`;
}

function styleLabSchemeText(scheme, roles = scheme.roles) {
  return STYLE_LAB_ROLES
    .map((role) => styleLabRoleLine(role, roles[role.key]))
    .join('\n');
}

function styleLabTemplateAccentColor(scheme, index = 0) {
  return scheme.modeColors[index % scheme.modeColors.length] || scheme.roles.accent;
}

function styleLabTemplateRoles(scheme, index = 0) {
  return {
    ...scheme.roles,
    accent: styleLabTemplateAccentColor(scheme, index),
  };
}

function styleTemplateCopyText(template, scheme, index = 0) {
  const roles = styleLabTemplateRoles(scheme, index);

  return [
    `应用样式：${template.label}`,
    `配色逻辑：${scheme.mode.label}（${scheme.mode.intent}）`,
    `主色：${scheme.anchor.name} ${scheme.anchor.hex}`,
    `关系色：${styleLabModeColorText(scheme)}`,
    `当前样式应用关系色：${roles.accent.name} ${roles.accent.hex}`,
    `适用场景：${template.scene}`,
    `建议尺寸：${template.size}`,
    `版式骨架：${template.layout}`,
    '配色角色：',
    styleLabSchemeText(scheme, roles),
    `排版结构：${template.structure}`,
    'CSS 变量：',
    styleLabCssVariables(scheme, roles),
  ].join('\n');
}

function styleLabCopyText() {
  if (!currentStyleLabScheme) return '';

  return [
    '中国传统色配色应用方案',
    `主色来源：${currentStyleLabScheme.anchor.name} ${currentStyleLabScheme.anchor.hex}`,
    `配色逻辑：${currentStyleLabScheme.mode.label}（${currentStyleLabScheme.mode.intent}）`,
    `关系色：${styleLabModeColorText(currentStyleLabScheme)}`,
    `标题可读性：${styleLabContrastLabel(currentStyleLabScheme)}，适合直接放主标题；仍建议按实际字号复核。`,
    '',
    '当前配色角色：',
    styleLabSchemeText(currentStyleLabScheme),
    '',
    '样式卡：',
    STYLE_LAB_TEMPLATES.map((template, index) => {
      const accent = styleLabTemplateAccentColor(currentStyleLabScheme, index);
      return `- ${template.label}：${template.scene}；${template.size}；${template.layout}；关系色 ${accent.name} ${accent.hex}`;
    }).join('\n'),
    '',
    'CSS 变量：',
    styleLabCssVariables(currentStyleLabScheme),
  ].join('\n');
}

function styleLabModeColorText(scheme) {
  return scheme.modeColors.length
    ? scheme.modeColors.map((color) => `${color.name} ${color.hex}`).join(' / ')
    : '当前主色没有可用关系色，已使用色库兜底方案';
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
    `--ctc-mode: ${scheme.mode.key}; /* ${scheme.mode.label} */`,
    `--ctc-anchor: ${scheme.anchor.hex}; /* ${scheme.anchor.name} */`,
    `--ctc-bg: ${roleColor('background').hex}; /* ${roleColor('background').name} */`,
    `--ctc-title: ${roleColor('title').hex}; /* ${roleColor('title').name} */`,
    `--ctc-body: ${roleColor('body').hex}; /* ${roleColor('body').name} */`,
    `--ctc-main: ${roleColor('support').hex}; /* ${roleColor('support').name} */`,
    `--ctc-relation: ${roleColor('accent').hex}; /* ${roleColor('accent').name} */`,
  ].join('\n');
}

function styleLabReadinessMarkup(scheme) {
  const contrast = styleLabContrastValue(scheme);
  const contrastLabel = contrast >= 7 ? '正文也稳' : '适合大标题';

  return `
    <span>
      <strong>${escapeHtml(styleLabContrastLabel(scheme))}</strong>
      <small>标题对比 · ${escapeHtml(contrastLabel)}</small>
    </span>
    <span>
      <strong>${escapeHtml(String(scheme.modeColors.length || 1))}</strong>
      <small>当前模式关系色</small>
    </span>
    <span>
      <strong>${escapeHtml(scheme.anchor.id)}</strong>
      <small>主色编号</small>
    </span>
  `;
}

function renderStyleAnchor(scheme) {
  const harmony = harmonyForImage(scheme.anchorImage);
  const anchorValue = colorValue(scheme.anchor);
  const meta = [
    scheme.anchor.id,
    harmony?.hueFamily,
    harmony?.temperature,
    colorValueLabel(),
  ].filter(Boolean).join(' · ');

  if (styleAnchor) styleAnchor.textContent = `${scheme.anchor.name} ${anchorValue}`;
  if (styleAnchorMeta) styleAnchorMeta.textContent = meta;
  if (styleAnchorSwatch) styleAnchorSwatch.style.setProperty('--anchor-color', scheme.anchor.hex);
  if (styleAnchorCopyButton) {
    styleAnchorCopyButton.style.setProperty('--anchor-color', scheme.anchor.hex);
    styleAnchorCopyButton.setAttribute('aria-label', `复制当前主色 ${scheme.anchor.name} ${anchorValue}`);
  }
  if (styleColorSearch) {
    styleColorSearch.value = styleColorOptionValue(scheme.anchorImage);
  }
  if (styleFormatSelect) {
    styleFormatSelect.value = selectedColorValueType;
  }
}

function styleLabModeMarkup(mode) {
  const selected = mode.key === currentStyleLabModeKey;

  return `
    <button class="style-mode-button" type="button" data-style-mode="${escapeHtml(mode.key)}" aria-pressed="${selected ? 'true' : 'false'}">
      <strong>${escapeHtml(mode.label)}</strong>
      <span>${escapeHtml(mode.intent)}</span>
    </button>
  `;
}

function styleLabModeColorMarkup(color) {
  const value = colorValue(color);
  const label = `${color.name} ${value}`;

  return `
    <button class="style-mode-color" type="button" data-style-mode-color="${escapeHtml(color.id)}" aria-label="复制关系色 ${escapeHtml(label)}">
      <span style="--mode-color: ${escapeHtml(color.hex)}" aria-hidden="true"></span>
      <strong>${escapeHtml(color.name)}</strong>
      <em data-style-mode-value>${escapeHtml(value)}</em>
    </button>
  `;
}

function renderStyleLabModes(scheme = currentStyleLabScheme) {
  if (styleModeList) {
    styleModeList.innerHTML = STYLE_LAB_MODES.map(styleLabModeMarkup).join('');
  }

  const mode = styleLabMode();
  if (styleModeSummary) {
    styleModeSummary.textContent = `${mode.label}：${mode.summary} 右侧样式卡会依次套用下方关系色。`;
  }

  if (styleModeColors) {
    styleModeColors.innerHTML = scheme?.modeColors?.length
      ? scheme.modeColors.map(styleLabModeColorMarkup).join('')
      : '<span class="style-mode-empty">当前主色没有可用关系色，已使用色库兜底方案</span>';
  }
}

function styleLabCanvasMarkup(template) {
  if (template.id === 'quote-card') {
    return `
      <div class="style-sample-quote-mark">“</div>
      <p class="style-sample-quote">${escapeHtml(template.title)}</p>
      <span class="style-sample-line"></span>
      <small>${escapeHtml(template.subtitle)}</small>
      <em>${escapeHtml(template.meta)}</em>
    `;
  }

  if (template.id === 'course-cover') {
    return `
      <span class="style-sample-overline">${escapeHtml(template.overline)}</span>
      <h3>${escapeHtml(template.title)}</h3>
      <p>${escapeHtml(template.subtitle)}</p>
      <div class="style-sample-module">
        <span>色名</span>
        <span>比例</span>
        <span>交付</span>
      </div>
      <em>${escapeHtml(template.meta)}</em>
    `;
  }

  if (template.id === 'event-poster') {
    return `
      <span class="style-sample-overline">${escapeHtml(template.overline)}</span>
      <strong class="style-sample-date">06.18</strong>
      <h3>${escapeHtml(template.title)}</h3>
      <p>${escapeHtml(template.subtitle)}</p>
      <em>${escapeHtml(template.meta)}</em>
    `;
  }

  if (template.id === 'column-header') {
    return `
      <span class="style-sample-rule"></span>
      <span class="style-sample-overline">${escapeHtml(template.overline)}</span>
      <h3>${escapeHtml(template.title)}</h3>
      <p>${escapeHtml(template.subtitle)}</p>
      <em>${escapeHtml(template.meta)}</em>
    `;
  }

  return `
    <span class="style-sample-overline">${escapeHtml(template.overline)}</span>
    <h3>${escapeHtml(template.title)}</h3>
    <p>${escapeHtml(template.subtitle)}</p>
    <em>${escapeHtml(template.meta)}</em>
  `;
}

function styleRoleSwatchMarkup(role, color) {
  const value = colorValue(color);
  const label = `${role.label} ${color.name} ${value}`;

  return `
    <button class="style-palette-role" type="button" data-style-role="${role.key}" aria-label="复制 ${escapeHtml(label)}" title="复制 ${escapeHtml(label)}">
      <span class="style-role-swatch" style="--style-role-color: ${escapeHtml(color.hex)}" aria-hidden="true"></span>
      <span>
        <strong>${escapeHtml(role.label)}</strong>
        <small>${escapeHtml(role.ratio)} · ${escapeHtml(role.use)}</small>
      </span>
      <em data-style-role-value>${escapeHtml(color.name)} ${escapeHtml(value)}</em>
    </button>
  `;
}

function styleTemplateRoleMarkup(role, color, index) {
  const value = colorValue(color);
  const label = `${role.label} ${color.name} ${value}`;

  return `
    <button class="style-template-role" type="button" data-style-template-role="${escapeHtml(role.key)}" data-style-template-index="${index}" aria-label="复制 ${escapeHtml(label)}">
      <i style="--style-role-color: ${escapeHtml(color.hex)}" aria-hidden="true"></i>
      <b>${escapeHtml(role.label)}</b>
      <em data-style-template-value>${escapeHtml(color.name)} ${escapeHtml(value)}</em>
    </button>
  `;
}

function styleTemplateMarkup(template, index, scheme) {
  const roles = styleLabTemplateRoles(scheme, index);
  const customProperties = [
    `--sample-bg: ${roles.background.hex}`,
    `--sample-title: ${roles.title.hex}`,
    `--sample-body: ${roles.body.hex}`,
    `--sample-support: ${roles.support.hex}`,
    `--sample-accent: ${roles.accent.hex}`,
  ].join('; ');

  return `
    <article class="style-template-card style-template-card--${escapeHtml(template.id)}" data-style-template-id="${escapeHtml(template.id)}" style="${escapeHtml(customProperties)}">
      <header class="style-template-meta">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(template.label)}</strong>
        <button type="button" data-style-copy="${escapeHtml(template.id)}" aria-label="复制 ${escapeHtml(template.label)} 配色方案">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
        </button>
      </header>
      <div class="style-template-canvas">
        ${styleLabCanvasMarkup(template)}
      </div>
      <div class="style-template-brief">
        <p><strong>用在</strong><span>${escapeHtml(template.scene)}</span></p>
        <p><strong>尺寸</strong><span>${escapeHtml(template.size)}</span></p>
        <p><strong>骨架</strong><span>${escapeHtml(template.layout)}</span></p>
      </div>
      <footer class="style-template-roles">
        ${STYLE_LAB_ROLES.map((role) => styleTemplateRoleMarkup(role, roles[role.key], index)).join('')}
      </footer>
    </article>
  `;
}

function setStyleLabStatus(message) {
  if (!styleStatus) return;

  styleStatus.textContent = message;
  styleStatus.dataset.visible = message ? 'true' : 'false';
}

function renderStyleLab(statusMessage = '', options = {}) {
  if (!styleLab) return;

  if (options.newAnchor || !currentStyleAnchorImage) {
    currentStyleAnchorImage = randomColorItems(1)[0] || images.find((image) => image.hex);
  }

  const scheme = createStyleLabScheme(currentStyleAnchorImage, currentStyleLabModeKey);
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
  styleLab.innerHTML = STYLE_LAB_TEMPLATES
    .map((template, index) => styleTemplateMarkup(template, index, scheme))
    .join('');
  setStyleLabStatus(statusMessage || `当前主色：${scheme.anchor.name}；已应用 ${scheme.mode.label} 配色逻辑`);
}

function applyStyleAnchor(image, statusMessage = '') {
  if (!image?.hex) return;

  currentStyleAnchorImage = image;
  renderStyleLab(statusMessage || `已切换主色：${colorName(image)} ${colorValue(image)}，保留 ${styleLabMode().label} 配色逻辑`);
}

function commitStyleColorSearch() {
  if (!styleColorSearch) return;

  const image = findStyleColorImage(styleColorSearch.value);
  if (!image) {
    setStyleLabStatus('没有找到对应颜色；可以输入色名、编号或 HEX。');
    return;
  }

  applyStyleAnchor(image);
  styleColorSearch.blur();
}

async function copyStyleTemplate(templateId) {
  const template = STYLE_LAB_TEMPLATES.find((item) => item.id === templateId);
  const templateIndex = STYLE_LAB_TEMPLATES.findIndex((item) => item.id === templateId);
  if (!template || !currentStyleLabScheme) return;

  await writeClipboard(styleTemplateCopyText(template, currentStyleLabScheme, templateIndex));
  setStyleLabStatus(`已复制：${template.label}`);
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

async function copyStyleModeColor(colorId) {
  const color = currentStyleLabScheme?.modeColors.find((item) => item.id === colorId);
  if (!color) return;

  const copyText = `${color.name} ${colorValue(color)}`;
  await writeClipboard(copyText);
  setStyleLabStatus(`已复制关系色：${copyText}`);
}

async function copyStyleCssVariables() {
  if (!currentStyleLabScheme) return;

  await writeClipboard(styleLabCssVariables(currentStyleLabScheme));
  setStyleLabStatus('已复制 CSS 变量');
}

async function copyStyleTemplateColor(roleKey, templateIndex) {
  const role = STYLE_LAB_ROLES.find((item) => item.key === roleKey);
  const roles = currentStyleLabScheme ? styleLabTemplateRoles(currentStyleLabScheme, templateIndex) : null;
  const color = roles?.[roleKey];
  if (!role || !color) return;

  const copyText = `${role.label}：${color.name} ${colorValue(color)}`;
  await writeClipboard(copyText);
  setStyleLabStatus(`已复制预览色值：${copyText}`);
}

function usePreviewColorInStyleLab() {
  if (!currentHeroPreviewImage) return;

  applyStyleAnchor(currentHeroPreviewImage, `已把 ${colorName(currentHeroPreviewImage)} 应用到配色工作台`);
  heroPreviewDialog?.close();
  document.querySelector('#style-lab')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
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
    `${colorName(image)} 属于 ${tone || '当前传统色'}。`,
    `在「${relation.label}」里，建议先把它当作${harmonyAnchorRole(relation)}。`,
    colorNames ? `本组可先试 ${colorNames}，从小面积开始，确认可读性后再扩大。` : '当前没有足够关系色时，先用主色和中性色建立基础版面。',
  ].join('');
}

function harmonyRelationColors(harmony, relation) {
  return harmony?.[relation.key] || [];
}

function previewRoleLabel(harmony, relation) {
  const hsl = harmony?.hsl || {};

  if (['complementary', 'splitComplementary'].includes(relation.key)) {
    return '主色负责识别，关系色只放在最需要被看见的位置';
  }
  if (relation.key === 'triadic') {
    return '主色定整体气质，关系色适合拆成栏目或系列角色';
  }
  if (relation.key === 'tetradic') {
    return '主色先定层级，其他色必须先分配用途再上场';
  }
  if (relation.key === 'grayTone') {
    return '主色保留记忆点，灰调色负责降噪和承托信息';
  }
  if (relation.key === 'neutral') {
    return '主色负责表达，中性色负责留白、边界和阅读秩序';
  }
  if (relation.key === 'lighter' || hsl.l >= 84) {
    return '优先做背景、留白或浅层模块，正文需要另配深色';
  }
  if (relation.key === 'darker' || hsl.l <= 28) {
    return '优先做标题、正文、边界或深底压重';
  }
  if (relation.key === 'analogous') {
    return '主色做视觉气质，邻近色负责柔和过渡';
  }
  if (hsl.s >= 72) {
    return '主色很有存在感，适合做识别或小面积重点';
  }

  return harmonyAnchorRole(relation);
}

function previewReadabilityText(harmony, relation) {
  const hsl = harmony?.hsl || {};

  if (hsl.l >= 82) return '小号文字慎用，正文需配深色；更适合作底色或空白层。';
  if (hsl.l <= 28) return '适合压重和深底；标题可用，正文需配明色并放大留白。';
  if (hsl.s >= 72) return '高饱和不要同权重铺满，先检查按钮、标题和正文对比。';
  if (relation.key === 'grayTone' || relation.key === 'neutral') return '适合信息密集场景；用明暗差建立层级，少靠更多颜色。';
  if (['complementary', 'splitComplementary'].includes(relation.key)) return '关系色越强，面积越小；点击前先确认唯一焦点。';

  return '先测标题、正文、按钮三处对比，再决定是否扩大使用。';
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
        <dd>${escapeHtml(relation.area || '先小面积验证，再扩大使用。')}</dd>
      </div>
      <div>
        <dt>可读</dt>
        <dd>${escapeHtml(previewReadabilityText(harmony, relation))}</dd>
      </div>
    </dl>
    <div class="preview-guide-related" aria-label="${escapeHtml(relation.label)}关系色">
      ${relationColors.length
        ? relationColors.map((color, index) => previewRelationButtonMarkup(color, relation, index)).join('')
        : '<span>当前关系色不足，先用主色和中性色建立基础版面。</span>'}
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
      <p><b>适合方向</b>${escapeHtml(relation.direction || '')}</p>
    </div>
    <div class="harmony-use-grid">
      <section>
        <strong>典型场景</strong>
        <p>${escapeHtml(relation.scenarios || '')}</p>
      </section>
      <section>
        <strong>设计师用法</strong>
        <p>${escapeHtml(relation.designerUse || '')}</p>
      </section>
      <section>
        <strong>普通人理解</strong>
        <p>${escapeHtml(relation.plainUse || '')}</p>
      </section>
      <section>
        <strong>面积建议</strong>
        <p>${escapeHtml(relation.area || '')}</p>
      </section>
      <section>
        <strong>当前色落地</strong>
        <p>${escapeHtml(harmonyAnchorUseText(image, harmony, relation, colors))}</p>
      </section>
      <section>
        <strong>风险提醒</strong>
        <p>${escapeHtml(relation.risk || '')}</p>
      </section>
    </div>
    <p class="harmony-panel-method">
      <strong>依据</strong>
      <span>${escapeHtml(relation.method || '')} 全量用途表见 <a href="docs/chinese-color-harmony-use-cases.csv">CSV</a>。</span>
    </p>
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

  queueScrollControlsUpdate();
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

function applyFilters() {
  const query = normalize(searchInput?.value || '');
  currentHue = hueFilter?.value || 'all';
  const filteredItems = images.filter((image) => {
    const searchable = `${image.id} ${image.file} ${image.path} ${image.hex || ''}`.toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    const matchesHue = currentHue === 'all' ? true : hueFromHex(image.hex) === currentHue;
    return matchesQuery && matchesHue;
  });
  currentItems = randomizeImageOrder(filteredItems);
  visibleCount = 24;
  shuffled = true;
  renderGallery();
}

function shuffleItems() {
  currentItems = randomizeImageOrder(currentItems);
  visibleCount = 24;
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
  if (currentStyleLabScheme) {
    renderStyleAnchor(currentStyleLabScheme);
    if (stylePalette) {
      stylePalette.innerHTML = STYLE_LAB_ROLES
        .map((role) => styleRoleSwatchMarkup(role, currentStyleLabScheme.roles[role.key]))
        .join('');
    }
    renderStyleLabModes(currentStyleLabScheme);
    if (styleLab) {
      styleLab.innerHTML = STYLE_LAB_TEMPLATES
        .map((template, index) => styleTemplateMarkup(template, index, currentStyleLabScheme))
        .join('');
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
    const searchable = `${image.id} ${colorName(image)} ${image.file} ${image.hex || ''}`.toLowerCase();
    return searchable.includes(query);
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
renderGallery();
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
searchInput?.addEventListener('input', applySearch);
hueFilter?.addEventListener('change', applyFilters);
shuffleButton?.addEventListener('click', shuffleItems);
loadMoreButton?.addEventListener('click', () => {
  appendGalleryItems(shuffled ? 24 : 32);
});
styleRefreshButton?.addEventListener('click', () => {
  renderStyleLab(`已换主色，并应用 ${styleLabMode().label} 配色逻辑`, { newAnchor: true });
});
styleAnchorCopyButton?.addEventListener('click', copyStyleAnchor);
styleColorSearch?.addEventListener('change', commitStyleColorSearch);
styleColorSearch?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;

  event.preventDefault();
  commitStyleColorSearch();
});
styleFormatSelect?.addEventListener('change', () => {
  saveColorValueType(styleFormatSelect.value);
  updateCopyControls();
  setStyleLabStatus(`已切换复制格式：${colorValueLabel()}，后续色值复制会沿用`);
});
styleCopyAllButton?.addEventListener('click', async () => {
  const copyText = styleLabCopyText();
  if (!copyText) return;

  await writeClipboard(copyText);
  setStyleLabStatus('已复制当前整组方案');
});
styleCopyCssButton?.addEventListener('click', copyStyleCssVariables);
styleModeList?.addEventListener('click', (event) => {
  const modeButton = event.target.closest('[data-style-mode]');
  if (!modeButton) return;

  currentStyleLabModeKey = modeButton.dataset.styleMode;
  renderStyleLab(`已在 ${currentStyleLabScheme?.anchor.name || '当前主色'} 上应用 ${styleLabMode().label} 配色逻辑`);
});
styleModeColors?.addEventListener('click', (event) => {
  const colorButton = event.target.closest('[data-style-mode-color]');
  if (colorButton) copyStyleModeColor(colorButton.dataset.styleModeColor);
});
stylePalette?.addEventListener('click', (event) => {
  const roleButton = event.target.closest('[data-style-role]');
  if (roleButton) copyStyleRole(roleButton.dataset.styleRole);
});
styleLab?.addEventListener('click', (event) => {
  const roleButton = event.target.closest('[data-style-template-role]');
  if (roleButton) {
    copyStyleTemplateColor(
      roleButton.dataset.styleTemplateRole,
      Number.parseInt(roleButton.dataset.styleTemplateIndex || '0', 10),
    );
    return;
  }

  const copyButton = event.target.closest('[data-style-copy]');
  if (copyButton) {
    copyStyleTemplate(copyButton.dataset.styleCopy);
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
masterSearchInput?.addEventListener('input', renderMasterList);
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
