(() => {
  const images = (window.TRADITIONAL_COLOR_IMAGES || []).map((image) => {
    const name = image.file.replace(/^\d+-/, '').replace(/\.[^.]+$/, '');
    const cleanHex = image.hex.toUpperCase();
    const rgb = rgbFromHex(cleanHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      ...image,
      name,
      cleanHex,
      rgb,
      hsl,
      hueGroup: hueGroupFromHsl(hsl),
      searchText: `${image.id} ${name} ${cleanHex}`.toLowerCase(),
    };
  });

  const state = {
    activeId: images[0]?.id,
    hue: 'all',
    query: '',
    filtered: images,
  };

  const els = {
    stage: document.querySelector('[data-explorer-stage]'),
    name: document.querySelector('[data-explorer-name]'),
    note: document.querySelector('[data-explorer-note]'),
    hex: document.querySelector('[data-explorer-hex]'),
    rgb: document.querySelector('[data-explorer-rgb]'),
    hsl: document.querySelector('[data-explorer-hsl]'),
    count: document.querySelector('[data-explorer-count]'),
    index: document.querySelector('[data-explorer-index]'),
    search: document.querySelector('[data-explorer-search]'),
    spectrum: document.querySelector('[data-explorer-spectrum]'),
    filterCount: document.querySelector('[data-explorer-filter-count]'),
    hueLabel: document.querySelector('[data-explorer-hue-label]'),
    lightness: document.querySelector('[data-explorer-lightness]'),
    saturation: document.querySelector('[data-explorer-saturation]'),
    status: document.querySelector('[data-explorer-status]'),
    dictionary: document.querySelector('[data-explorer-dictionary]'),
  };

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

  function rgbFromHex(hex) {
    const value = Number.parseInt(hex.replace('#', ''), 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    let hue = 0;
    let saturation = 0;

    if (max !== min) {
      const delta = max - min;
      saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
      if (max === green) hue = (blue - red) / delta + 2;
      if (max === blue) hue = (red - green) / delta + 4;
      hue *= 60;
    }

    return {
      h: Math.round(hue),
      s: Math.round(saturation * 100),
      l: Math.round(lightness * 100),
    };
  }

  function hueGroupFromHsl(hsl) {
    if (hsl.s < 13) return 'neutral';
    if (hsl.h < 12 || hsl.h >= 345) return 'red';
    if (hsl.h < 42) return 'orange';
    if (hsl.h < 72) return 'yellow';
    if (hsl.h < 155) return 'green';
    if (hsl.h < 195) return 'cyan';
    if (hsl.h < 255) return 'blue';
    if (hsl.h < 315) return 'purple';
    return 'red';
  }

  function textColorFor(hex) {
    const rgb = rgbFromHex(hex);
    const luminance = [rgb.r, rgb.g, rgb.b]
      .map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      })
      .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
    return luminance > 0.52 ? '#111111' : '#f7f7f4';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function rgbText(color) {
    return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  }

  function hslText(color) {
    return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
  }

  function activeColor() {
    return images.find((color) => color.id === state.activeId) || state.filtered[0] || images[0];
  }

  function applyFilters() {
    state.filtered = images.filter((color) => {
      const matchesHue = state.hue === 'all' || color.hueGroup === state.hue;
      const matchesQuery = !state.query || color.searchText.includes(state.query);
      return matchesHue && matchesQuery;
    });

    if (state.filtered.length && !state.filtered.some((color) => color.id === state.activeId)) {
      state.activeId = state.filtered[0].id;
    }
  }

  function renderActive() {
    const color = activeColor();
    if (!color) return;
    const textColor = textColorFor(color.cleanHex);
    const position = images.findIndex((item) => item.id === color.id) + 1;

    els.stage?.style.setProperty('--active-color', color.cleanHex);
    els.stage?.style.setProperty('--active-ink', textColor);
    els.stage?.style.setProperty('--active-soft', colorMixText(textColor));
    if (els.name) els.name.textContent = color.name;
    if (els.note) els.note.textContent = `${color.id} 号传统色 · ${HUE_LABELS[color.hueGroup]} · 在色谱中快速定位、复制和比较。`;
    if (els.hex) els.hex.textContent = color.cleanHex;
    if (els.rgb) els.rgb.textContent = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
    if (els.hsl) els.hsl.textContent = `${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%`;
    if (els.count) els.count.textContent = `${images.length} 色`;
    if (els.index) els.index.textContent = `${String(position).padStart(3, '0')} / ${images.length}`;
    if (els.hueLabel) els.hueLabel.textContent = HUE_LABELS[color.hueGroup];
    if (els.lightness) els.lightness.textContent = `${color.hsl.l}%`;
    if (els.saturation) els.saturation.textContent = `${color.hsl.s}%`;
    if (els.dictionary) els.dictionary.href = `dictionary.html?q=${encodeURIComponent(color.name)}`;

    document.querySelectorAll('[data-spectrum-color]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.spectrumColor === color.id));
    });

    const activeButton = document.querySelector(`[data-spectrum-color="${CSS.escape(color.id)}"]`);
    activeButton?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function colorMixText(textColor) {
    return textColor === '#111111' ? 'rgba(17, 17, 17, 0.72)' : 'rgba(247, 247, 244, 0.76)';
  }

  function renderSpectrum() {
    if (!els.spectrum) return;
    const items = state.filtered;
    els.spectrum.innerHTML = items.length
      ? items.map((color) => `
          <button
            type="button"
            data-spectrum-color="${escapeAttribute(color.id)}"
            aria-pressed="${color.id === state.activeId}"
            title="${escapeAttribute(`${color.id} ${color.name} ${color.cleanHex}`)}"
            style="--swatch:${escapeAttribute(color.cleanHex)}; --swatch-ink:${textColorFor(color.cleanHex)}"
          >
            <span>${escapeHtml(color.name)}</span>
            <small>${escapeHtml(color.cleanHex)}</small>
          </button>
        `).join('')
      : '<p class="explorer-empty">没有找到匹配的传统色</p>';

    if (els.filterCount) {
      els.filterCount.textContent = `${items.length} / ${images.length} · ${HUE_LABELS[state.hue]}`;
    }
  }

  function render() {
    applyFilters();
    renderSpectrum();
    renderActive();
  }

  function move(step) {
    if (!state.filtered.length) return;
    const currentIndex = Math.max(0, state.filtered.findIndex((color) => color.id === state.activeId));
    const nextIndex = (currentIndex + step + state.filtered.length) % state.filtered.length;
    state.activeId = state.filtered[nextIndex].id;
    renderActive();
  }

  function pickRandom() {
    if (!state.filtered.length) return;
    const next = state.filtered[Math.floor(Math.random() * state.filtered.length)];
    state.activeId = next.id;
    renderActive();
  }

  function copyValue(type) {
    const color = activeColor();
    if (!color) return;
    const value = {
      hex: color.cleanHex,
      rgb: rgbText(color),
      hsl: hslText(color),
    }[type] || color.cleanHex;

    copyText(value).then(() => {
      if (els.status) els.status.textContent = `已复制 ${value}`;
    }).catch(() => {
      if (els.status) els.status.textContent = '复制失败，请手动复制';
    });
  }

  function copyText(value) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('Copy failed'));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[char]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
  }

  function initFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const colorParam = normalize(params.get('color') || params.get('q'));
    if (!colorParam) return;
    const match = images.find((color) => (
      normalize(color.id) === colorParam ||
      normalize(color.name) === colorParam ||
      normalize(color.cleanHex) === colorParam
    ));
    if (match) state.activeId = match.id;
  }

  document.querySelector('[data-explorer-prev]')?.addEventListener('click', () => move(-1));
  document.querySelector('[data-explorer-next]')?.addEventListener('click', () => move(1));
  document.querySelector('[data-explorer-random]')?.addEventListener('click', pickRandom);

  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', () => copyValue(button.dataset.copyValue));
  });

  els.search?.addEventListener('input', () => {
    state.query = normalize(els.search.value);
    render();
  });

  document.querySelectorAll('[data-explorer-hue]').forEach((button) => {
    button.addEventListener('click', () => {
      state.hue = button.dataset.explorerHue;
      document.querySelectorAll('[data-explorer-hue]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      render();
    });
  });

  els.spectrum?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-spectrum-color]');
    if (!button) return;
    state.activeId = button.dataset.spectrumColor;
    renderActive();
  });

  document.addEventListener('keydown', (event) => {
    const editable = event.target.closest('input, textarea, select, [contenteditable="true"]');
    if (editable) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
    if (event.key === ' ') {
      event.preventDefault();
      pickRandom();
    }
  });

  initFromUrl();
  render();
})();
