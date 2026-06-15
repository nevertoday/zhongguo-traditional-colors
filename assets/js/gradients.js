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
  const detail = document.querySelector('[data-gradient-detail]');
  const searchInput = document.querySelector('[data-gradient-search]');
  const hueFilter = document.querySelector('[data-gradient-hue]');
  const hueList = document.querySelector('[data-gradient-hue-list]');
  const typeFilter = document.querySelector('[data-gradient-type]');
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
  const GRADIENT_TYPES = [
    {
      key: 'tonal',
      label: '单色阶',
      deck: '4 color tonal',
      relationKeys: ['lighter', 'same', 'analogous', 'darker'],
      copyHint: '适合背景、按钮状态、信息层级',
    },
    {
      key: 'analogous',
      label: '邻近组',
      deck: '5 color analogous',
      relationKeys: ['lighter', 'analogous', 'same', 'secondary', 'darker'],
      copyHint: '适合海报、横幅、柔和品牌视觉',
    },
    {
      key: 'split',
      label: '互补组',
      deck: '5 color split',
      relationKeys: ['lighter', 'splitComplementary', 'analogous', 'accent', 'darker'],
      copyHint: '适合强对比但不刺眼的主视觉',
    },
    {
      key: 'triadic',
      label: '三色组',
      deck: '4 color triadic',
      relationKeys: ['lighter', 'triadic', 'same', 'accent'],
      copyHint: '适合插画、数据分组、活动页',
    },
    {
      key: 'tetradic',
      label: '四色组',
      deck: '5 color tetradic',
      relationKeys: ['lighter', 'tetradic', 'same', 'accent', 'darker'],
      copyHint: '适合复杂界面、系列卡片、专题页',
    },
    {
      key: 'temperature',
      label: '冷暖组',
      deck: '5 color temperature',
      relationKeys: ['lighter', 'temperatureContrast', 'same', 'neutral', 'darker'],
      copyHint: '适合季节、材质、空间氛围切换',
    },
  ];
  const TYPE_BY_KEY = new Map(GRADIENT_TYPES.map((type) => [type.key, type]));

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
  const TYPE_LABELS = Object.fromEntries([['all', '全部渐变'], ...GRADIENT_TYPES.map((type) => [type.key, type.label])]);
  const HUE_OPTIONS = [
    ['all', '全部', '#111111'],
    ['red', '红', '#B13B2E'],
    ['orange', '橙', '#D47A2F'],
    ['yellow', '黄', '#D8B947'],
    ['green', '绿', '#4F8A54'],
    ['cyan', '青', '#3D8F93'],
    ['blue', '蓝', '#3F69A8'],
    ['purple', '紫', '#73518A'],
    ['neutral', '灰', '#8A8780'],
  ];

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

  function relatedColors(anchor, relationKeys, excludedIds = new Set(), limit = 1) {
    const harmony = harmonies[anchor.id] || {};
    const colors = [];
    for (const key of relationKeys) {
      for (const id of harmony[key] || []) {
        if (id === anchor.id || excludedIds.has(id)) continue;
        const color = lookupColor(id);
        if (!color?.hex) continue;
        excludedIds.add(color.id);
        colors.push(color);
        if (colors.length >= limit) return colors;
      }
    }
    return colors;
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
    const pairs = [
      { from: tones[0], to: tones[3], label: '浅阶 -> 深阶' },
      { from: tones[1], to: tones[2], label: '本色 -> 邻近' },
      { from: tones[3], to: tones[2], label: '深阶 -> 邻近' },
      { from: tones[0], to: tones[1], label: '浅阶 -> 本色' },
    ].map(pairWithCss);

    const type = TYPE_BY_KEY.get('tonal');
    const stops = tones.map((tone, index) => ({ ...tone, stop: Math.round((index / (tones.length - 1)) * 100) }));
    const css = pairs[0].css;
    return { anchor, tones, stops, paths: pairs, pairs, hsl, type, css };
  }

  function fallbackTone(anchor, role, index, total) {
    const ratio = total <= 1 ? 0 : index / (total - 1);
    if (ratio < 0.5) return fallbackColor(anchor, role, mixHex(anchor.hex, '#FFFFFF', 0.58 - ratio * 0.38), `fallback-${index}`);
    return fallbackColor(anchor, role, mixHex(anchor.hex, '#000000', (ratio - 0.45) * 0.48), `fallback-${index}`);
  }

  function stopRoleFor(type, index, anchorSlot, total) {
    if (index === anchorSlot) return '本色';
    if (index === 0) return '起点';
    if (index === total - 1) return '收束';
    const relationLabels = {
      analogous: '邻近',
      split: '互补',
      triadic: '三角',
      tetradic: '四角',
      temperature: '冷暖',
    };
    return relationLabels[type.key] || type.label;
  }

  function gradientSet(image, typeKey = 'tonal') {
    if (typeKey === 'tonal') return gradientLogic(image);

    const type = TYPE_BY_KEY.get(typeKey) || TYPE_BY_KEY.get('analogous');
    const anchor = {
      id: image.id,
      name: colorName(image),
      hex: cleanHex(image.hex),
    };
    const hsl = harmonies[image.id]?.hsl || hslFromRgb(rgbFromHex(anchor.hex));
    const excluded = new Set([anchor.id]);
    const targetCount = 4;
    const picked = relatedColors(anchor, type.relationKeys, excluded, targetCount - 1);
    const rawStops = [anchor, ...picked];

    while (rawStops.length < targetCount) {
      rawStops.push(fallbackTone(anchor, type.label, rawStops.length, targetCount));
    }

    const anchorSlot = 1;
    const ordered = [...rawStops.slice(1, anchorSlot + 1), anchor, ...rawStops.slice(anchorSlot + 1)]
      .slice(0, targetCount);
    const stops = ordered.map((tone, index) => ({
      ...tone,
      role: stopRoleFor(type, index, anchorSlot, ordered.length),
      stop: Math.round((index / (ordered.length - 1)) * 100),
    }));
    const pairs = [
      { from: stops[0], to: stops[3], label: `${stops[0].name} -> ${stops[3].name}` },
      { from: stops[1], to: stops[2], label: `${stops[1].name} -> ${stops[2].name}` },
      { from: stops[3], to: stops[2], label: `${stops[3].name} -> ${stops[2].name}` },
      { from: stops[0], to: stops[1], label: `${stops[0].name} -> ${stops[1].name}` },
    ].map(pairWithCss);
    const css = pairs[0].css;

    return { anchor, tones: stops.slice(0, 4), stops, paths: pairs, pairs, hsl, type, css };
  }

  function pairWithCss(pair) {
    return {
      ...pair,
      css: `linear-gradient(90deg, ${pair.from.hex} 0%, ${pair.to.hex} 100%)`,
    };
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

  function filteredGradientItems() {
    const type = typeFilter?.value || 'all';
    const types = type === 'all' ? GRADIENT_TYPES : [TYPE_BY_KEY.get(type)].filter(Boolean);
    return filteredImages().flatMap((image) => types.map((gradientType) => ({
      id: `${image.id}-${gradientType.key}`,
      image,
      type: gradientType,
    })));
  }

  function toneMarkup(tone, index) {
    return `
      <button class="gradient-tone gradient-tone-${index + 1}" type="button" data-gradient-copy-stop="${escapeAttribute(tone.name)} ${escapeAttribute(tone.hex)}" style="--tone: ${escapeAttribute(tone.hex)}; --tone-ink: ${textColorFor(tone.hex)}" aria-label="复制 ${escapeAttribute(tone.name)} ${escapeAttribute(tone.hex)}">
        <span class="gradient-tone-swatch" aria-hidden="true"></span>
        <strong>${escapeHtml(tone.role)}</strong>
        <small>${escapeHtml(tone.name)} · ${escapeHtml(tone.hex)}</small>
      </button>
    `;
  }

  function pairMarkup(pair, index, compact = false) {
    return `
      <button class="gradient-pair${compact ? ' gradient-pair-compact' : ''}" type="button" data-gradient-copy-pair="${escapeAttribute(`${pair.label}: ${pair.css}`)}" style="--pair-from: ${escapeAttribute(pair.from.hex)}; --pair-to: ${escapeAttribute(pair.to.hex)}" aria-label="复制双色渐变 ${escapeAttribute(pair.label)}">
        <span class="gradient-path-track" aria-hidden="true"></span>
        <small>${escapeHtml(pair.from.hex.replace('#', ''))}</small>
        <small>${escapeHtml(pair.to.hex.replace('#', ''))}</small>
      </button>
    `;
  }

  function pairListMarkup(logic, compact = false) {
    return `
      <div class="gradient-pair-list${compact ? ' gradient-pair-list-compact' : ''}" aria-label="${escapeAttribute(logic.type.label)} 双色渐变组合">
        ${logic.pairs.map((pair, index) => pairMarkup(pair, index, compact)).join('')}
      </div>
    `;
  }

  function copyTextFor(logic) {
    const toneLines = logic.stops.map((tone) => `${tone.role}: ${tone.name} ${tone.hex} ${tone.stop}%`);
    const pathLines = logic.pairs.map((path) => `${path.label}: ${path.from.hex} -> ${path.to.hex}\nCSS: ${path.css}`);
    return [
      `${logic.anchor.name} ${logic.type.label} 双色渐变组`,
      ...toneLines,
      ...pathLines,
    ].join('\n');
  }

  function detailUrlFor(image, typeKey) {
    return `gradients.html?color=${encodeURIComponent(image.id)}&type=${encodeURIComponent(typeKey)}`;
  }

  function cardMarkup(item) {
    const { image, type } = item;
    const logic = gradientSet(image, type.key);
    const hue = hueFromHex(logic.anchor.hex);
    const hslLabel = `H${logic.hsl.h} S${logic.hsl.s} L${logic.hsl.l}`;
    const style = [
      `--card-anchor: ${logic.anchor.hex}`,
      `--card-light: ${logic.tones[0].hex}`,
      `--card-close: ${logic.tones[2].hex}`,
      `--card-deep: ${logic.tones[3].hex}`,
      `--card-ink: ${textColorFor(logic.anchor.hex)}`,
      `--gradient-css: ${logic.css}`,
    ].join('; ');

    return `
      <article class="gradient-card" role="button" tabindex="0" data-gradient-card="${escapeAttribute(item.id)}" data-gradient-color="${escapeAttribute(image.id)}" data-gradient-card-type="${escapeAttribute(type.key)}" style="${escapeAttribute(style)}" aria-label="复制 ${escapeAttribute(logic.anchor.name)} ${escapeAttribute(type.label)} 的渐变逻辑">
        <div class="gradient-card-head">
          <span>${escapeHtml(type.label)}</span>
          <h3><a href="${escapeAttribute(detailUrlFor(image, type.key))}">${escapeHtml(logic.anchor.name)}</a></h3>
          <small>${escapeHtml(HUE_LABELS[hue] || '传统色')} · 4 色 / ${escapeHtml(String(logic.pairs.length))} 条双色渐变</small>
        </div>
        <div class="gradient-tone-grid" aria-label="${escapeAttribute(logic.anchor.name)} 的四个渐变节点">
          ${logic.stops.map(toneMarkup).join('')}
        </div>
        <div class="gradient-card-rule"></div>
        ${pairListMarkup(logic, true)}
      </article>
    `;
  }

  function updateMeta(total, visible) {
    if (countLabel) {
      const hue = hueFilter?.value || 'all';
      const type = typeFilter?.value || 'all';
      countLabel.textContent = `已显示 ${visible} / ${total} 张 · ${HUE_LABELS[hue] || '全部色系'} · ${TYPE_LABELS[type] || '全部渐变'}`;
    }
    if (loadMoreButton) {
      loadMoreButton.hidden = visible >= total;
      loadMoreButton.disabled = visible >= total;
    }
  }

  function render({ reset = false } = {}) {
    if (!grid) return;
    const items = filteredGradientItems();
    renderedItems = items;
    if (reset) visibleCount = INITIAL_VISIBLE;

    const visibleItems = items.slice(0, visibleCount);
    grid.innerHTML = visibleItems.length
      ? visibleItems.map(cardMarkup).join('')
      : '<div class="gradient-empty"><strong>没有找到颜色</strong><span>换一个色名、编号或 HEX。</span></div>';

    updateMeta(items.length, visibleItems.length);
  }

  function renderHueButtons() {
    if (!hueList) return;
    const current = hueFilter?.value || 'all';
    hueList.innerHTML = HUE_OPTIONS.map(([key, label, color]) => `
      <button type="button" data-gradient-hue-button="${escapeAttribute(key)}" aria-pressed="${String(key === current)}" style="--hue-color: ${escapeAttribute(color)}">${escapeHtml(label)}</button>
    `).join('');
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
    const item = renderedItems.find((renderedItem) => renderedItem.id === id);
    if (!item) return;
    const logic = gradientSet(item.image, item.type.key);
    await writeClipboard(copyTextFor(logic));
    showToast(`已复制 ${logic.anchor.name} · ${logic.type.label}`);
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
    const picked = pool[Math.floor(Math.random() * pool.length)];
    const image = picked.image || picked;
    const targetId = picked.id || renderedItems.find((item) => item.image.id === image.id)?.id;
    const index = targetId ? renderedItems.findIndex((item) => item.id === targetId) : -1;
    if (index >= visibleCount) {
      visibleCount = Math.min(renderedItems.length, index + 1);
      render();
    }
    if (targetId) focusCard(targetId);
  }

  function renderDetailFromUrl() {
    if (!detail) return;
    const params = new URLSearchParams(window.location.search);
    const colorId = params.get('color');
    if (!colorId) {
      detail.innerHTML = '';
      return;
    }

    const image = imagesById.get(colorId);
    if (!image) {
      detail.innerHTML = '<section class="gradient-detail gradient-empty"><strong>没有找到这张渐变色板</strong><span>可以回到列表重新选择。</span></section>';
      return;
    }

    const typeKey = TYPE_BY_KEY.has(params.get('type')) ? params.get('type') : 'analogous';
    const logic = gradientSet(image, typeKey);
    const alternatives = GRADIENT_TYPES
      .filter((type) => type.key !== typeKey)
      .map((type) => `<a href="${escapeAttribute(detailUrlFor(image, type.key))}">${escapeHtml(type.label)}</a>`)
      .join('');

    detail.innerHTML = `
      <section class="gradient-detail" style="--detail-anchor: ${escapeAttribute(logic.anchor.hex)}; --gradient-css: ${escapeAttribute(logic.css)}" aria-label="${escapeAttribute(logic.anchor.name)} ${escapeAttribute(logic.type.label)} 详情">
        <div class="gradient-detail-copy">
          <span class="section-kicker">Gradient Detail</span>
          <h2>${escapeHtml(logic.anchor.name)} · ${escapeHtml(logic.type.label)}</h2>
          <p>${escapeHtml(logic.type.copyHint)}。这张色板由 4 个传统色组成，下方每一条都是独立的 2 色渐变。</p>
          <div class="gradient-detail-actions">
            <button class="gradient-action" type="button" data-gradient-copy-detail="${escapeAttribute(image.id)}" data-gradient-copy-type="${escapeAttribute(typeKey)}">
              <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
              复制详情
            </button>
            <a class="gradient-detail-link" href="colors/${escapeAttribute(image.file.replace(/\.png$/, '.html'))}">查看颜色详情</a>
            <a class="gradient-detail-link" href="gradients.html">返回全部渐变</a>
          </div>
        </div>
        ${pairListMarkup(logic)}
        <div class="gradient-detail-stops">
          ${logic.stops.map((tone) => `
            <a href="colors/${escapeAttribute((imagesById.get(tone.id)?.file || `${tone.id}.png`).replace(/\.png$/, '.html'))}" class="gradient-detail-stop" style="--tone: ${escapeAttribute(tone.hex)}; --tone-ink: ${textColorFor(tone.hex)}">
              <span aria-hidden="true"></span>
              <strong>${escapeHtml(tone.name)}</strong>
              <small>${escapeHtml(tone.hex)} · ${escapeHtml(String(tone.stop))}%</small>
            </a>
          `).join('')}
        </div>
        <div class="gradient-detail-alt" aria-label="其他渐变类型">${alternatives}</div>
      </section>
    `;
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
    const stopButton = event.target.closest('[data-gradient-copy-stop]');
    if (stopButton) {
      writeClipboard(stopButton.dataset.gradientCopyStop).then(() => showToast(`已复制 ${stopButton.dataset.gradientCopyStop}`));
      return;
    }
    const pairButton = event.target.closest('[data-gradient-copy-pair]');
    if (pairButton) {
      writeClipboard(pairButton.dataset.gradientCopyPair).then(() => showToast('已复制双色渐变'));
      return;
    }
    if (event.target.closest('a, button')) return;
    const card = event.target.closest('[data-gradient-card]');
    if (!card) return;
    copyCard(card.dataset.gradientCard);
  });

  grid?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('a, button')) return;
    const card = event.target.closest('[data-gradient-card]');
    if (!card) return;
    event.preventDefault();
    copyCard(card.dataset.gradientCard);
  });

  searchInput?.addEventListener('input', debounce(() => render({ reset: true }), 200));
  hueFilter?.addEventListener('change', () => {
    renderHueButtons();
    render({ reset: true });
  });
  hueList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gradient-hue-button]');
    if (!button || !hueFilter) return;
    hueFilter.value = button.dataset.gradientHueButton || 'all';
    renderHueButtons();
    render({ reset: true });
  });
  typeFilter?.addEventListener('change', () => render({ reset: true }));
  detail?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-gradient-copy-detail]');
    if (!button) return;
    const image = imagesById.get(button.dataset.gradientCopyDetail);
    if (!image) return;
    const logic = gradientSet(image, button.dataset.gradientCopyType);
    await writeClipboard(copyTextFor(logic));
    showToast(`已复制 ${logic.anchor.name} · ${logic.type.label}`);
  });
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
  renderHueButtons();
  renderDetailFromUrl();
  render({ reset: true });
})();
