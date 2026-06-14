(() => {
  const images = window.TRADITIONAL_COLOR_IMAGES || [];
  const colorHarmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
  const imagesById = new Map(images.map((image) => [image.id, image]));
  const debounce = window.ZH_UTILS?.debounce || ((fn, delay) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  });

  const dictionaryGrid = document.querySelector('[data-dictionary-grid]');
  const dictionarySearch = document.querySelector('[data-dictionary-search]');
  const dictionaryHue = document.querySelector('[data-dictionary-hue]');
  const dictionaryCount = document.querySelector('[data-dictionary-count]');
  const dictionaryRandom = document.querySelector('[data-dictionary-random]');
  const detailDialog = document.querySelector('[data-color-detail-dialog]');
  const detailClose = document.querySelector('[data-color-detail-close]');
  const detailSwatch = document.querySelector('[data-color-detail-swatch]');
  const detailKicker = document.querySelector('[data-color-detail-kicker]');
  const detailTitle = document.querySelector('[data-color-detail-title]');
  const detailNote = document.querySelector('[data-color-detail-note]');
  const detailValues = document.querySelector('[data-color-detail-values]');
  const detailProfile = document.querySelector('[data-color-detail-profile]');
  const detailRelated = document.querySelector('[data-color-detail-related]');
  const detailStatus = document.querySelector('[data-color-detail-status]');
  const detailDownload = document.querySelector('[data-color-detail-download]');
  const detailPage = document.querySelector('[data-color-detail-page]');
  const detailStyle = document.querySelector('[data-color-detail-style]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeColorMeta = document.querySelector('[data-theme-color]');
  const siteHeader = document.querySelector('.site-header');
  const siteNav = document.querySelector('#site-nav');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const footerColorButtons = document.querySelectorAll('[data-footer-color]');
  const footerCopyStatus = document.querySelector('[data-footer-copy-status]');

  let footerCopyTimer;
  let navResizeFrame;

  const HUE_LABELS = {
    all: '全部色系',
    red: '红色系',
    orange: '橙色系',
    yellow: '黄色系',
    green: '绿色系',
    cyan: '青色系',
    blue: '蓝色系',
    purple: '紫色系',
    neutral: '中性色',
  };

  const RELATION_TYPES = [
    { key: 'same', label: '同类', hint: '统一、系列、低风险延展' },
    { key: 'analogous', label: '邻近', hint: '柔和过渡和层次' },
    { key: 'complementary', label: '互补', hint: '重点、按钮、反差' },
    { key: 'splitComplementary', label: '分裂互补', hint: '醒目但更稳' },
    { key: 'triadic', label: '三角', hint: '多色系统和活动视觉' },
    { key: 'tetradic', label: '四角', hint: '复杂画面和分区' },
    { key: 'temperatureContrast', label: '冷暖', hint: '情绪转折和主次对比' },
    { key: 'lighter', label: '明色', hint: '背景、留白、轻量模块' },
    { key: 'darker', label: '暗色', hint: '标题、结构、压重' },
    { key: 'grayTone', label: '灰调', hint: '克制、耐看、长内容' },
    { key: 'neutral', label: '中性', hint: '文本、边框、辅助底色' },
    { key: 'secondary', label: '辅助', hint: '模块和次级内容' },
    { key: 'accent', label: '强调', hint: '焦点和行动入口' },
  ];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]);
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function colorTitle(image) {
    return image.file.replace(/\.[^.]+$/, '');
  }

  function colorName(image) {
    return colorTitle(image).replace(/^\d+-/, '');
  }

  function encodedPath(path) {
    return path.split('/').map((part) => encodeURIComponent(part)).join('/');
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return '未知';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
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

    themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle?.setAttribute('aria-label', nextTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    if (themeLabel) themeLabel.textContent = nextTheme === 'dark' ? '亮色' : '暗色';
    themeIcon?.setAttribute('icon', nextTheme === 'dark' ? 'lucide:sun' : 'lucide:moon');
    themeColorMeta?.setAttribute('content', nextTheme === 'dark' ? '#11100e' : '#f7f7f4');
  }

  function setMobileNavOpen(open) {
    if (!siteHeader || !navToggle) return;

    siteHeader.dataset.navOpen = open ? 'true' : 'false';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '收起导航' : '展开导航');
    navToggle.querySelector('iconify-icon')?.setAttribute('icon', open ? 'lucide:x' : 'lucide:menu');
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

  function randomColorItems(count) {
    const pool = images.filter((image) => image.hex);
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(index + 1);
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    return pool.slice(0, count);
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

  function colorFormats(hex) {
    const rgb = rgbFromHex(hex);
    if (!rgb) {
      return [
        { label: 'HEX', value: hex || '' },
      ];
    }

    const hsl = hslFromRgb(rgb);
    const cmyk = cmykFromRgb(rgb);
    return [
      { label: 'HEX', value: hex },
      { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    ];
  }

  function hueFromHex(hex) {
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

  function temperatureFromHue(hue) {
    return ['red', 'orange', 'yellow', 'purple'].includes(hue) ? '暖' : '冷';
  }

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

  function textColorFor(hex) {
    const rgb = rgbFromHex(hex);
    if (!rgb) return '#111111';

    const luminance = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const relative = 0.2126 * luminance[0] + 0.7152 * luminance[1] + 0.0722 * luminance[2];
    return relative > 0.52 ? '#111111' : '#f7f7f4';
  }

  function lookupColor(color) {
    if (typeof color === 'string') {
      const image = imagesById.get(color);
      return image ? { id: image.id, name: colorName(image), hex: image.hex } : null;
    }

    const image = imagesById.get(color?.id);
    if (!image && !color?.hex) return null;

    return {
      id: color?.id || image?.id || '',
      name: color?.name || (image ? colorName(image) : ''),
      hex: color?.hex || image?.hex || '',
    };
  }

  function imageMatches(image, query, hue) {
    const searchable = `${image.id} ${colorName(image)} ${image.file} ${image.hex || ''}`.toLowerCase();
    const matchesQuery = query
      ? (window.ZH_COLOR_SEARCH?.matchesImage?.(image, query) || searchable.includes(query))
      : true;
    const matchesHue = hue === 'all' ? true : hueFromHex(image.hex) === hue;
    return matchesQuery && matchesHue;
  }

  function filteredImages() {
    const query = normalize(dictionarySearch?.value);
    const hue = dictionaryHue?.value || 'all';
    return images.filter((image) => imageMatches(image, query, hue));
  }

  function dictionaryCardMarkup(image) {
    const name = colorName(image);
    const hex = image.hex || '';
    const hue = hueFromHex(hex);

    return `
      <button class="dictionary-card" type="button" data-color-card="${escapeAttribute(image.id)}" style="--swatch: ${escapeAttribute(hex)}; --swatch-ink: ${textColorFor(hex)}" aria-label="查看 ${escapeAttribute(name)} ${escapeAttribute(hex)} 的颜色信息">
        <span class="dictionary-swatch" aria-hidden="true"></span>
        <span class="dictionary-card-name">${escapeHtml(name)}</span>
        <span class="dictionary-card-meta">
          <span>${escapeHtml(image.id)}</span>
          <span>${escapeHtml(hex)}</span>
          <span>${escapeHtml(HUE_LABELS[hue] || '色系')}</span>
        </span>
      </button>
    `;
  }

  function renderDictionary() {
    if (!dictionaryGrid) return;

    const items = filteredImages();
    dictionaryGrid.innerHTML = items.length
      ? items.map(dictionaryCardMarkup).join('')
      : '<div class="dictionary-empty"><strong>没有找到颜色</strong><span>换一个色名、编号或 HEX。</span></div>';

    if (dictionaryCount) {
      const hue = dictionaryHue?.value || 'all';
      dictionaryCount.textContent = `${items.length} / ${images.length} 色 · ${HUE_LABELS[hue] || '全部色系'}`;
    }
  }

  function colorValueRowMarkup(format) {
    return `
      <div>
        <dt>${escapeHtml(format.label)}</dt>
        <dd>
          <button type="button" data-copy-color-value="${escapeAttribute(format.value)}" aria-label="复制 ${escapeAttribute(format.label)} ${escapeAttribute(format.value)}">
            ${escapeHtml(format.value)}
          </button>
        </dd>
      </div>
    `;
  }

  function profileRowMarkup(label, value) {
    return `
      <div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      </div>
    `;
  }

  function relationButtonMarkup(color) {
    return `
      <button class="color-related-chip" type="button" data-related-color="${escapeAttribute(color.id)}" style="--swatch: ${escapeAttribute(color.hex)}" aria-label="查看 ${escapeAttribute(color.name)} ${escapeAttribute(color.hex)}">
        <span aria-hidden="true"></span>
        <strong>${escapeHtml(color.name)}</strong>
        <small>${escapeHtml(color.hex)}</small>
      </button>
    `;
  }

  function relationGroupMarkup(relation, colors) {
    return `
      <section class="color-related-group">
        <header>
          <strong>${escapeHtml(relation.label)}</strong>
          <span>${escapeHtml(relation.hint)}</span>
        </header>
        <div>${colors.map(relationButtonMarkup).join('')}</div>
      </section>
    `;
  }

  function renderRelatedColors(harmony) {
    if (!detailRelated) return;

    const groups = RELATION_TYPES.map((relation) => {
      const colors = (harmony?.[relation.key] || [])
        .map(lookupColor)
        .filter(Boolean);
      return colors.length ? relationGroupMarkup(relation, colors) : '';
    }).filter(Boolean);

    detailRelated.innerHTML = groups.length
      ? groups.join('')
      : '<div class="color-related-empty">暂无配色关系数据。</div>';
  }

  function openColorDetail(id) {
    const image = imagesById.get(id);
    if (!image || !detailDialog) return;

    const name = colorName(image);
    const hex = image.hex || '';
    const rgb = rgbFromHex(hex);
    const harmony = colorHarmonies[image.id] || {};
    const hsl = harmony.hsl || (rgb ? hslFromRgb(rgb) : null);
    const hue = hueFromHex(hex);
    const hueFamily = harmony.hueFamily || HUE_LABELS[hue] || '未归类';
    const temperature = harmony.temperature || temperatureFromHue(hue);

    detailDialog.style.setProperty('--detail-color', hex);
    detailDialog.style.setProperty('--detail-ink', textColorFor(hex));
    if (detailSwatch) detailSwatch.style.setProperty('--swatch', hex);
    if (detailKicker) detailKicker.textContent = `${image.id} · ${hex}`;
    if (detailTitle) detailTitle.textContent = name;
    if (detailNote) detailNote.textContent = toneNote(hsl, temperature);
    if (detailValues) {
      detailValues.innerHTML = colorFormats(hex).map(colorValueRowMarkup).join('');
    }
    if (detailProfile) {
      detailProfile.innerHTML = [
        ['编号', image.id],
        ['色系', hueFamily],
        ['冷暖', temperature],
        ['明度', hsl ? `${lightnessLabel(hsl.l)} · L${hsl.l}` : '未知'],
        ['饱和', hsl ? `${saturationLabel(hsl.s)} · S${hsl.s}` : '未知'],
        ['文件', image.file],
        ['原图', formatBytes(image.size)],
      ].map(([label, value]) => profileRowMarkup(label, value)).join('');
    }

    renderRelatedColors(harmony);

    if (detailDownload) {
      detailDownload.href = encodedPath(image.path);
      detailDownload.setAttribute('download', image.file);
      detailDownload.setAttribute('aria-label', `下载 ${name} 色卡`);
    }
    if (detailPage) {
      detailPage.href = `colors/${encodeURIComponent(`${image.id}-${name}`)}.html`;
      detailPage.setAttribute('aria-label', `打开 ${name} 的独立详情页`);
    }
    if (detailStyle) {
      detailStyle.href = `style-lab.html?color=${encodeURIComponent(image.id)}`;
      detailStyle.setAttribute('aria-label', `用 ${name} 进入场景试色`);
    }
    if (detailStatus) detailStatus.textContent = '';

    if (typeof detailDialog.showModal === 'function' && !detailDialog.open) {
      detailDialog.showModal();
    } else if (!detailDialog.open) {
      detailDialog.setAttribute('open', '');
    }

    detailDialog.scrollTop = 0;
  }

  async function copyColorValue(value) {
    await writeClipboard(value);

    if (detailStatus) {
      detailStatus.textContent = `已复制 ${value}`;
      detailStatus.dataset.copied = 'true';
      window.setTimeout(() => {
        if (detailStatus.textContent === `已复制 ${value}`) {
          detailStatus.textContent = '';
          delete detailStatus.dataset.copied;
        }
      }, 1400);
    }
  }

  function openRandomColor() {
    const items = filteredImages();
    const pool = items.length ? items : images;
    const image = pool[Math.floor(Math.random() * pool.length)];
    if (image) openColorDetail(image.id);
  }

  dictionaryGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-color-card]');
    if (!button) return;
    openColorDetail(button.dataset.colorCard);
  });

  detailDialog?.addEventListener('click', (event) => {
    if (event.target === detailDialog) {
      detailDialog.close();
      return;
    }

    const copyButton = event.target.closest('[data-copy-color-value]');
    if (copyButton) {
      copyColorValue(copyButton.dataset.copyColorValue);
      return;
    }

    const relatedButton = event.target.closest('[data-related-color]');
    if (relatedButton) {
      openColorDetail(relatedButton.dataset.relatedColor);
    }
  });

  detailClose?.addEventListener('click', () => detailDialog?.close());
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
  dictionarySearch?.addEventListener('input', debounce(renderDictionary, 200));
  dictionaryHue?.addEventListener('change', renderDictionary);
  dictionaryRandom?.addEventListener('click', openRandomColor);

  setTheme(currentTheme());
  buildFooterSpectrum();

  // Honor a ?q= search param so the homepage SearchAction (sitelinks searchbox)
  // and shared links land on a pre-filtered dictionary view.
  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery && dictionarySearch) {
    dictionarySearch.value = initialQuery;
  }

  renderDictionary();
})();
