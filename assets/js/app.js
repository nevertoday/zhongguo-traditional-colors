const images = window.TRADITIONAL_COLOR_IMAGES || [];
const project = window.TRADITIONAL_COLOR_PROJECT || {
  count: images.length,
  totalBytes: images.reduce((total, image) => total + image.size, 0),
  archiveName: 'zhongguo-traditional-colors-images.zip',
};

const gallery = document.querySelector('[data-gallery]');
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
const openMasterListButton = document.querySelector('[data-open-master-list]');
const closeMasterListButton = document.querySelector('[data-close-master-list]');
const copyMasterListButton = document.querySelector('[data-copy-master-list]');
const masterListStatus = document.querySelector('[data-master-list-status]');
const masterSearchInput = document.querySelector('[data-master-search]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeToggleIcon = document.querySelector('[data-theme-icon]');
const themeToggleLabel = document.querySelector('[data-theme-label]');
const themeColorMeta = document.querySelector('[data-theme-color]');
const footerColorButtons = document.querySelectorAll('[data-footer-color]');
const footerCopyStatus = document.querySelector('[data-footer-copy-status]');
const scrollUpButton = document.querySelector('[data-scroll-up]');
const scrollDownButton = document.querySelector('[data-scroll-down]');
const titleHoverElements = document.querySelectorAll('h1, h2, h3');
const heroPreviewDialog = document.querySelector('[data-hero-preview-dialog]');
const heroPreviewImage = document.querySelector('[data-hero-preview-image]');
const heroPreviewTitle = document.querySelector('[data-hero-preview-title]');
const heroPreviewHex = document.querySelector('[data-hero-preview-hex]');
const heroPreviewFile = document.querySelector('[data-hero-preview-file]');
const heroPreviewSize = document.querySelector('[data-hero-preview-size]');
const heroPreviewDownload = document.querySelector('[data-hero-preview-download]');
const heroPreviewStatus = document.querySelector('[data-hero-preview-status]');
const closeHeroPreviewButton = document.querySelector('[data-close-hero-preview]');
const copyHeroPreviewButton = document.querySelector('[data-copy-hero-preview]');
const heroPreviewFormat = document.querySelector('[data-hero-preview-format]');

let visibleCount = 24;
let currentItems = [...images];
let shuffled = false;
let currentHue = 'all';
let selectedColorValueType = getSavedColorValueType();
let footerCopyTimer;
let scrollControlFrame;
let currentHeroPreviewImage;
const titleColorTimers = new WeakMap();

const COLOR_VALUE_TYPES = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'cmyk', label: 'CMYK' },
];

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

function randomColorItems(count) {
  const pool = images.filter((image) => image.hex);
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
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

function nearestBackgroundRgb(node) {
  let current = node;
  while (current && current !== document.documentElement) {
    const background = parseRgbColor(window.getComputedStyle(current).backgroundColor);
    if (background && background.a > 0) return background;
    current = current.parentElement;
  }

  return currentTheme() === 'dark'
    ? { r: 17, g: 16, b: 14, a: 1 }
    : { r: 247, g: 247, b: 244, a: 1 };
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

function readableColorsForTitle(title) {
  const background = nearestBackgroundRgb(title);
  const scored = images
    .filter((image) => image.hex)
    .map((image) => {
      const rgb = rgbFromHex(image.hex);
      return rgb ? { image, ratio: contrastRatio(rgb, background) } : null;
    })
    .filter(Boolean)
    .filter((item) => item.ratio >= 4.5);

  const pool = scored.length
    ? scored
    : images
      .filter((image) => image.hex)
      .map((image) => {
        const rgb = rgbFromHex(image.hex);
        return rgb ? { image, ratio: contrastRatio(rgb, background) } : null;
      })
      .filter(Boolean)
      .sort((first, second) => second.ratio - first.ratio)
      .slice(0, 64);

  return pool.map((item) => item.image);
}

function readableColorForTitle(title) {
  const pool = readableColorsForTitle(title);
  return pool[randomInt(pool.length)];
}

function activateTitleColor(title) {
  window.clearTimeout(titleColorTimers.get(title));

  const pool = readableColorsForTitle(title);
  if (!pool.length) return;

  const steps = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 4;
  let index = 0;

  const applyNextColor = () => {
    const color = pool[randomInt(pool.length)];
    if (!color) return;

    title.style.setProperty('--title-hover-color', color.hex);
    title.dataset.titleHoverColor = `${colorName(color)} ${color.hex}`;
    title.classList.add('title-color-active');
    index += 1;

    if (index < steps && title.matches(':hover, :focus')) {
      titleColorTimers.set(title, window.setTimeout(applyNextColor, 95));
    }
  };

  applyNextColor();
}

function clearTitleColor(title) {
  window.clearTimeout(titleColorTimers.get(title));
  title.classList.remove('title-color-active');
}

function bindTitleColorHover() {
  titleHoverElements.forEach((title) => {
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
  if (heroPreviewDownload) {
    heroPreviewDownload.href = url;
    heroPreviewDownload.setAttribute('download', image.file);
  }
  if (heroPreviewStatus) heroPreviewStatus.textContent = `当前复制格式：${colorValueLabel()}`;

  if (typeof heroPreviewDialog.showModal === 'function') {
    heroPreviewDialog.showModal();
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
      <a class="card-image-link" href="${url}" target="_blank" rel="noopener" aria-label="打开 ${title} 原图">
        <img src="${thumbnailUrl}" alt="中国传统色色卡 ${title}" loading="lazy">
      </a>
      ${hex ? `<div class="copy-color-control">
        <button class="copy-color-button" type="button" data-copy-color="${image.id}" aria-label="复制 ${colorName(image)} ${colorValueLabel()} 色值 ${copyValue}">复制 <span data-copy-value>${copyValue}</span></button>
        <label class="copy-format">
          <span class="sr-only">选择复制色值类型</span>
          <select data-copy-format aria-label="复制色值类型">
            ${formatOptions}
          </select>
        </label>
      </div>` : ''}
      <div class="card-meta">
        <span>
          <strong>${displayTitle}</strong>
          <small>原图 ${formatBytes(image.size)}</small>
        </span>
        <a class="card-button" href="${url}" download aria-label="下载 ${title}">
          <iconify-icon icon="lucide:download" aria-hidden="true"></iconify-icon>
        </a>
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
  currentItems = images.filter((image) => {
    const searchable = `${image.id} ${image.file} ${image.path} ${image.hex || ''}`.toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    const matchesHue = currentHue === 'all' ? true : hueFromHex(image.hex) === currentHue;
    return matchesQuery && matchesHue;
  });
  visibleCount = 24;
  shuffled = false;
  renderGallery();
}

function shuffleItems() {
  const pool = [...currentItems];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  currentItems = pool;
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
renderGallery();
updateScrollControls();
bindTitleColorHover();

themeToggle?.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});
searchInput?.addEventListener('input', applySearch);
hueFilter?.addEventListener('change', applyFilters);
shuffleButton?.addEventListener('click', shuffleItems);
loadMoreButton?.addEventListener('click', () => {
  appendGalleryItems(shuffled ? 24 : 32);
});

gallery?.addEventListener('click', (event) => {
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

openMasterListButton?.addEventListener('click', openMasterList);
closeMasterListButton?.addEventListener('click', () => masterListDialog?.close());
closeHeroPreviewButton?.addEventListener('click', () => heroPreviewDialog?.close());
heroPreviewDialog?.addEventListener('click', (event) => {
  if (event.target === heroPreviewDialog) heroPreviewDialog.close();
});
copyHeroPreviewButton?.addEventListener('click', async () => {
  if (!currentHeroPreviewImage?.hex) return;

  const copyText = `${colorName(currentHeroPreviewImage)} ${colorValue(currentHeroPreviewImage)}`;
  await writeClipboard(copyText);
  if (heroPreviewStatus) {
    heroPreviewStatus.textContent = `已复制 ${colorValueLabel()}：${copyText}`;
  }
});
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
scrollUpButton?.addEventListener('click', () => scrollBySection('up'));
scrollDownButton?.addEventListener('click', () => scrollBySection('down'));
window.addEventListener('scroll', queueScrollControlsUpdate, { passive: true });
window.addEventListener('resize', queueScrollControlsUpdate);
zipButton?.addEventListener('click', downloadZip);
