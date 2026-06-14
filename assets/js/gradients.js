(() => {
  const images = (window.TRADITIONAL_COLOR_IMAGES || []).filter((image) => image?.hex);
  const harmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
  const imagesById = new Map(images.map((image) => [image.id, image]));
  const debounce = window.ZH_UTILS?.debounce || ((fn, delay) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  });

  const grid = document.querySelector('[data-gradient-grid]');
  const searchInput = document.querySelector('[data-gradient-search]');
  const hueFilter = document.querySelector('[data-gradient-hue]');
  const countLabel = document.querySelector('[data-gradient-count]');
  const randomButton = document.querySelector('[data-gradient-random]');
  const loadMoreButton = document.querySelector('[data-gradient-load-more]');
  const toast = document.querySelector('[data-gradient-toast]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeColorMeta = document.querySelector('[data-theme-color]');
  const siteHeader = document.querySelector('.site-header');
  const siteNav = document.querySelector('#site-nav');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const footerColorButtons = document.querySelectorAll('[data-footer-color]');
  const footerCopyStatus = document.querySelector('[data-footer-copy-status]');

  const INITIAL_VISIBLE = 18;
  const BATCH_SIZE = 18;

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

  let visibleCount = INITIAL_VISIBLE;
  let renderedItems = [];
  let toastTimer;
  let footerCopyTimer;
  let navResizeFrame;

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

  function cleanHex(hex) {
    const match = String(hex || '').trim().match(/^#?([0-9a-f]{6})$/i);
    return match ? `#${match[1].toUpperCase()}` : '#777777';
  }

  function colorName(image) {
    return image?.file?.replace(/\.[^.]+$/, '').replace(/^\d{3}-/, '') || '';
  }

  function rgbFromHex(hex) {
    const value = cleanHex(hex).slice(1);
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

  function hueFromHex(hex) {
    const hsl = hslFromRgb(rgbFromHex(hex));
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

  function textColorFor(hex) {
    const rgb = rgbFromHex(hex);
    const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    return luminance > 0.54 ? '#111111' : '#f7f7f4';
  }

  function mixHex(hex, target, ratio) {
    const first = rgbFromHex(hex);
    const second = rgbFromHex(target);
    const mix = (a, b) => Math.round(a * (1 - ratio) + b * ratio);
    const value = [mix(first.r, second.r), mix(first.g, second.g), mix(first.b, second.b)]
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('');
    return `#${value.toUpperCase()}`;
  }

  function lookupColor(id) {
    const image = imagesById.get(id);
    if (!image) return null;
    return {
      id: image.id,
      name: colorName(image),
      hex: cleanHex(image.hex),
    };
  }

  function relatedColor(anchor, relationKeys, excludedIds = new Set()) {
    const harmony = harmonies[anchor.id] || {};
    for (const key of relationKeys) {
      for (const id of harmony[key] || []) {
        if (id === anchor.id || excludedIds.has(id)) continue;
        const color = lookupColor(id);
        if (color?.hex) return color;
      }
    }
    return null;
  }

  function fallbackColor(anchor, label, hex, suffix) {
    return {
      id: `${anchor.id}-${suffix}`,
      name: label,
      hex: cleanHex(hex),
    };
  }

  function gradientLogic(image) {
    const anchor = {
      id: image.id,
      name: colorName(image),
      hex: cleanHex(image.hex),
    };
    const excluded = new Set([anchor.id]);
    const hsl = harmonies[image.id]?.hsl || hslFromRgb(rgbFromHex(anchor.hex));
    const lightMix = hsl.l > 78 ? 0.48 : 0.66;
    const darkMix = hsl.l < 34 ? 0.22 : 0.34;

    const light = relatedColor(anchor, ['lighter', 'grayTone', 'neutral'], excluded)
      || fallbackColor(anchor, '浅阶', mixHex(anchor.hex, '#FFFFFF', lightMix), 'light');
    excluded.add(light.id);

    const close = relatedColor(anchor, ['same', 'analogous', 'secondary'], excluded)
      || fallbackColor(anchor, '邻近', mixHex(anchor.hex, '#FFFFFF', 0.28), 'close');
    excluded.add(close.id);

    const deep = relatedColor(anchor, ['darker', 'accent', 'complementary'], excluded)
      || fallbackColor(anchor, '深阶', mixHex(anchor.hex, '#000000', darkMix), 'deep');

    const tones = [
      { ...light, role: '浅阶' },
      { ...anchor, role: '本色' },
      { ...close, role: '邻近' },
      { ...deep, role: '深阶' },
    ];
    const paths = [
      { from: tones[0], to: tones[1], label: '浅阶 -> 本色' },
      { from: tones[1], to: tones[2], label: '本色 -> 邻近' },
      { from: tones[1], to: tones[3], label: '本色 -> 深阶' },
      { from: tones[0], to: tones[3], label: '浅阶 -> 深阶' },
    ];
    const pairs = [
      [tones[0], tones[2]],
      [tones[1], tones[3]],
      [tones[2], tones[3]],
      [tones[0], tones[1]],
    ];

    return { anchor, tones, paths, pairs, hsl };
  }

  function imageMatches(image, query, hue) {
    const hex = cleanHex(image.hex);
    const searchable = `${image.id} ${colorName(image)} ${image.file} ${hex} ${hex.replace('#', '')}`.toLowerCase();
    const matchesQuery = query
      ? (window.ZH_COLOR_SEARCH?.matchesImage?.(image, query) || searchable.includes(query))
      : true;
    const matchesHue = hue === 'all' ? true : hueFromHex(hex) === hue;
    return matchesQuery && matchesHue;
  }

  function filteredImages() {
    const query = normalize(searchInput?.value);
    const hue = hueFilter?.value || 'all';
    const source = query && window.ZH_COLOR_SEARCH?.rankedImages
      ? window.ZH_COLOR_SEARCH.rankedImages(query, images.length)
      : images;
    return source.filter((image) => imageMatches(image, query, hue));
  }

  function toneMarkup(tone, index) {
    return `
      <span class="gradient-tone gradient-tone-${index + 1}" style="--tone: ${escapeAttribute(tone.hex)}; --tone-ink: ${textColorFor(tone.hex)}">
        <span class="gradient-tone-swatch" aria-hidden="true"></span>
        <strong>${escapeHtml(tone.hex.replace('#', ''))}</strong>
        <small>${escapeHtml(tone.role)} · ${escapeHtml(tone.name)}</small>
      </span>
    `;
  }

  function pairMarkup(pair) {
    return `
      <span class="gradient-pair" style="--pair-a: ${escapeAttribute(pair[0].hex)}; --pair-b: ${escapeAttribute(pair[1].hex)}" aria-label="${escapeAttribute(pair[0].name)} 到 ${escapeAttribute(pair[1].name)}">
        <span aria-hidden="true"></span>
      </span>
    `;
  }

  function pathMarkup(path) {
    return `
      <span class="gradient-path">
        <span class="gradient-path-track" style="--path-a: ${escapeAttribute(path.from.hex)}; --path-b: ${escapeAttribute(path.to.hex)}">
          <small>${escapeHtml(path.from.hex.replace('#', ''))}</small>
          <small>${escapeHtml(path.to.hex.replace('#', ''))}</small>
        </span>
        <span class="gradient-path-label">${escapeHtml(path.label)}</span>
      </span>
    `;
  }

  function copyTextFor(logic) {
    const toneLines = logic.tones.map((tone) => `${tone.role}: ${tone.name} ${tone.hex}`);
    const pathLines = logic.paths.map((path) => `${path.label}: ${path.from.hex} -> ${path.to.hex}`);
    return [
      `${logic.anchor.name} 渐变逻辑`,
      ...toneLines,
      ...pathLines,
    ].join('\n');
  }

  function cardMarkup(image) {
    const logic = gradientLogic(image);
    const hue = hueFromHex(logic.anchor.hex);
    const hslLabel = `H${logic.hsl.h} S${logic.hsl.s} L${logic.hsl.l}`;
    const style = [
      `--card-anchor: ${logic.anchor.hex}`,
      `--card-light: ${logic.tones[0].hex}`,
      `--card-close: ${logic.tones[2].hex}`,
      `--card-deep: ${logic.tones[3].hex}`,
      `--card-ink: ${textColorFor(logic.anchor.hex)}`,
    ].join('; ');

    return `
      <article class="gradient-card" role="button" tabindex="0" data-gradient-card="${escapeAttribute(image.id)}" style="${escapeAttribute(style)}" aria-label="复制 ${escapeAttribute(logic.anchor.name)} 的渐变逻辑">
        <div class="gradient-card-head">
          <span>4 color palette</span>
          <h3>${escapeHtml(logic.anchor.name)}的渐变逻辑</h3>
          <small>${escapeHtml(image.id)} · ${escapeHtml(logic.anchor.hex)} · ${escapeHtml(HUE_LABELS[hue] || '传统色')} · ${escapeHtml(hslLabel)}</small>
        </div>
        <div class="gradient-tone-grid" aria-label="${escapeAttribute(logic.anchor.name)} 的四个渐变节点">
          ${logic.tones.map(toneMarkup).join('')}
        </div>
        <div class="gradient-card-rule" aria-hidden="true"></div>
        <div class="gradient-card-lower">
          <section class="gradient-pairs" aria-label="双色切片">
            <h4>2 tone</h4>
            <div>${logic.pairs.map(pairMarkup).join('')}</div>
          </section>
          <section class="gradient-paths" aria-label="渐变路径">
            <h4>Gradation</h4>
            <div>${logic.paths.map(pathMarkup).join('')}</div>
          </section>
        </div>
      </article>
    `;
  }

  function updateMeta(total, visible) {
    if (countLabel) {
      const hue = hueFilter?.value || 'all';
      countLabel.textContent = `已显示 ${visible} / ${total} 张 · ${HUE_LABELS[hue] || '全部色系'}`;
    }
    if (loadMoreButton) {
      loadMoreButton.hidden = visible >= total;
      loadMoreButton.disabled = visible >= total;
    }
  }

  function render({ reset = false } = {}) {
    if (!grid) return;
    const items = filteredImages();
    renderedItems = items;
    if (reset) visibleCount = INITIAL_VISIBLE;

    const visibleItems = items.slice(0, visibleCount);
    grid.innerHTML = visibleItems.length
      ? visibleItems.map(cardMarkup).join('')
      : '<div class="gradient-empty"><strong>没有找到颜色</strong><span>换一个色名、编号或 HEX。</span></div>';

    updateMeta(items.length, visibleItems.length);
  }

  async function writeClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
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
    }, 1700);
  }

  async function copyCard(id) {
    const image = imagesById.get(id);
    if (!image) return;
    const logic = gradientLogic(image);
    await writeClipboard(copyTextFor(logic));
    showToast(`已复制 ${logic.anchor.name} 的渐变逻辑`);
  }

  function focusCard(id) {
    const card = [...(grid?.querySelectorAll('[data-gradient-card]') || [])]
      .find((item) => item.dataset.gradientCard === id);
    if (!card) return;
    card.focus({ preventScroll: true });
    card.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function randomColor() {
    const pool = renderedItems.length ? renderedItems : filteredImages();
    if (!pool.length) return;
    const image = pool[Math.floor(Math.random() * pool.length)];
    const index = renderedItems.findIndex((item) => item.id === image.id);
    if (index >= visibleCount) {
      visibleCount = Math.min(renderedItems.length, index + 1);
      render();
    }
    focusCard(image.id);
  }

  function loadMore() {
    visibleCount = Math.min(renderedItems.length, visibleCount + BATCH_SIZE);
    render();
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
    const pool = [...images];
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
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
      const hex = cleanHex(image.hex);
      const copyText = `${name} ${hex}`;
      button.style.setProperty('--spectrum-color', hex);
      button.style.setProperty('--spectrum-index', String(Math.floor(Math.random() * 9) + 1));
      button.dataset.footerCopyValue = copyText;
      button.title = `复制 ${copyText}`;
      button.setAttribute('aria-label', `复制 ${name} 色值 ${hex}`);
    });
  }

  grid?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-gradient-card]');
    if (!card) return;
    copyCard(card.dataset.gradientCard);
  });

  grid?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-gradient-card]');
    if (!card) return;
    event.preventDefault();
    copyCard(card.dataset.gradientCard);
  });

  searchInput?.addEventListener('input', debounce(() => render({ reset: true }), 200));
  hueFilter?.addEventListener('change', () => render({ reset: true }));
  randomButton?.addEventListener('click', randomColor);
  loadMoreButton?.addEventListener('click', loadMore);
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

  setTheme(currentTheme());
  buildFooterSpectrum();
  render({ reset: true });
})();
