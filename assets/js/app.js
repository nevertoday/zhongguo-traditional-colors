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
const previewDialog = document.querySelector('[data-preview-dialog]');
const previewImage = document.querySelector('[data-preview-image]');
const previewTitle = document.querySelector('[data-preview-title]');
const previewDownload = document.querySelector('[data-preview-download]');
const closePreview = document.querySelector('[data-close-preview]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeToggleIcon = document.querySelector('[data-theme-icon]');
const themeToggleLabel = document.querySelector('[data-theme-label]');
const themeColorMeta = document.querySelector('[data-theme-color]');

let visibleCount = 24;
let currentItems = [...images];
let shuffled = false;
let currentHue = 'all';

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

function hueFromHex(hex) {
  if (!hex) return 'neutral';

  const match = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!match) return 'neutral';

  const value = match[1];
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
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
    `<img src="${encodedPath(thumbnailPath(image))}" alt="中国传统色色卡 ${colorTitle(image)}" loading="eager">`
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

function cardMarkup(image) {
  const url = encodedPath(image.path);
  const previewUrl = encodedPath(thumbnailPath(image));
  const title = colorTitle(image);
  const hex = image.hex || '';
  const displayTitle = hex ? `${title} · ${hex}` : title;

  return `
    <article class="color-card">
      <button class="card-button" type="button" data-preview="${image.id}" aria-label="预览 ${title}">
        <iconify-icon icon="lucide:eye" aria-hidden="true"></iconify-icon>
      </button>
      <img src="${previewUrl}" alt="中国传统色色卡 ${title}" loading="lazy">
      ${hex ? `<button class="copy-hex" type="button" data-copy-hex="${hex}" aria-label="复制 ${colorName(image)} 色值 ${hex}">复制 ${hex}</button>` : ''}
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

function renderGallery() {
  if (!gallery) return;

  const visible = currentItems.slice(0, visibleCount);
  gallery.innerHTML = visible.length
    ? visible.map(cardMarkup).join('')
    : '<div class="empty-state"><strong>没有找到对应色卡</strong><span>换一个色名、编号、色值或色相试试，例如「黛」「001」「#F9F4DC」</span></div>';

  if (galleryStatus) {
    galleryStatus.textContent = `已显示 ${visible.length.toLocaleString('zh-CN')} / ${currentItems.length.toLocaleString('zh-CN')} 张`;
  }

  if (loadMoreButton) {
    loadMoreButton.hidden = visible.length >= currentItems.length;
  }
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

function openPreview(id) {
  const image = images.find((item) => item.id === id);
  if (!image || !previewDialog) return;

  const url = encodedPath(image.path);
  previewImage.src = url;
  previewImage.alt = `中国传统色色卡 ${colorTitle(image)}`;
  previewTitle.textContent = `${colorTitle(image)} · ${formatBytes(image.size)}`;
  previewDownload.href = url;
  previewDownload.setAttribute('download', image.file);

  if (typeof previewDialog.showModal === 'function') {
    previewDialog.showModal();
  }
}

async function copyHex(button) {
  const hex = button.dataset.copyHex;
  if (!hex) return;

  try {
    await navigator.clipboard.writeText(hex);
  } catch (error) {
    const input = document.createElement('input');
    input.value = hex;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }

  const original = button.textContent;
  button.textContent = '已复制';
  button.dataset.copied = 'true';
  window.setTimeout(() => {
    button.textContent = original;
    delete button.dataset.copied;
  }, 1200);
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
  zipButton.textContent = '生成中';
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
      zipStatus.textContent = `${error.message}。请通过本地服务器或 GitHub Pages 打开页面。`;
    }
  } finally {
    zipButton.disabled = false;
    zipButton.innerHTML = '<iconify-icon icon="lucide:download" aria-hidden="true"></iconify-icon>生成 ZIP';
  }
}

updateStats();
setTheme(currentTheme());
buildHero();
renderGallery();

themeToggle?.addEventListener('click', () => {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});
searchInput?.addEventListener('input', applySearch);
hueFilter?.addEventListener('change', applyFilters);
shuffleButton?.addEventListener('click', shuffleItems);
loadMoreButton?.addEventListener('click', () => {
  visibleCount += shuffled ? 24 : 32;
  renderGallery();
});

gallery?.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-copy-hex]');
  if (copyButton) {
    copyHex(copyButton);
    return;
  }

  const button = event.target.closest('[data-preview]');
  if (button) openPreview(button.dataset.preview);
});

closePreview?.addEventListener('click', () => previewDialog?.close());
previewDialog?.addEventListener('click', (event) => {
  if (event.target === previewDialog) previewDialog.close();
});
zipButton?.addEventListener('click', downloadZip);
