(() => {
  const images = (window.TRADITIONAL_COLOR_IMAGES || []).filter((image) => image?.hex);
  const fields = new WeakMap();
  let activeField = null;

  const CONNECTOR_PATTERN = /(&|\+|\/|\bwith\b|和|与)/gi;
  const HUE_LABELS = {
    red: '红色系',
    orange: '橙色系',
    yellow: '黄色系',
    green: '绿色系',
    cyan: '青色系',
    blue: '蓝色系',
    purple: '紫色系',
    neutral: '中性色',
  };

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
    return String(value || '').trim().toLowerCase();
  }

  function cleanHex(hex) {
    const value = String(hex || '').trim();
    if (!value) return '';
    return value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`;
  }

  function colorName(image) {
    return image?.file?.replace(/\.[^.]+$/, '').replace(/^\d{3}-/, '') || '';
  }

  function rgbFromHex(hex) {
    const match = cleanHex(hex).match(/^#([0-9A-F]{6})$/i);
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
    if (!rgb) return 'neutral';
    const hsl = hslFromRgb(rgb);
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

  function toneLabel(image) {
    const rgb = rgbFromHex(image.hex);
    if (!rgb) return '传统色';
    const hsl = hslFromRgb(rgb);
    if (hsl.l >= 82) return '高明度';
    if (hsl.l <= 28) return '低明度';
    if (hsl.s >= 70) return '高饱和';
    if (hsl.s <= 18) return '低饱和';
    return '中明度';
  }

  function searchableText(image) {
    const hex = cleanHex(image.hex);
    return [
      image.id,
      colorName(image),
      image.file,
      hex,
      hex.replace('#', ''),
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function fuzzySequenceScore(text, query) {
    const source = normalize(text);
    const value = normalize(query);
    if (!source || !value) return 0;

    let cursor = 0;
    let firstIndex = -1;
    let lastIndex = -1;
    for (const character of value) {
      const index = source.indexOf(character, cursor);
      if (index === -1) return 0;
      if (firstIndex === -1) firstIndex = index;
      lastIndex = index;
      cursor = index + 1;
    }

    const spreadPenalty = Math.max(0, lastIndex - firstIndex - value.length + 1);
    return Math.max(1, 120 - firstIndex * 4 - spreadPenalty * 6);
  }

  function matchesText(text, query) {
    const normalized = normalize(query);
    if (!normalized) return true;
    const source = normalize(text);
    return normalized.split(/\s+/).filter(Boolean).every((token) => (
      source.includes(token) || fuzzySequenceScore(source, token) > 0
    ));
  }

  function matchesImage(image, query) {
    return matchesText(searchableText(image), query);
  }

  function normalizeHexQuery(query) {
    const match = normalize(query).match(/#?([0-9a-f]{6})/i);
    return match ? `#${match[1].toUpperCase()}` : '';
  }

  function imageMatchScore(image, query) {
    const normalized = normalize(query);
    if (!normalized) return 0;
    const name = normalize(colorName(image));
    const id = normalize(image.id);
    const hex = cleanHex(image.hex);
    const plainHex = hex.replace('#', '').toLowerCase();
    const text = searchableText(image);
    const exactHex = normalizeHexQuery(normalized);

    if (exactHex && hex === exactHex) return 1400;
    if (name === normalized || id === normalized || plainHex === normalized) return 1250;
    if (name.startsWith(normalized) || id.startsWith(normalized) || plainHex.startsWith(normalized)) return 1000;
    if (name.includes(normalized)) return 880 - name.indexOf(normalized);
    if (id.includes(normalized) || plainHex.includes(normalized)) return 760;
    if (text.includes(normalized)) return 620;

    const fuzzyName = fuzzySequenceScore(name, normalized);
    if (fuzzyName) return 420 + fuzzyName;
    const fuzzyText = fuzzySequenceScore(text, normalized);
    return fuzzyText ? 220 + fuzzyText : 0;
  }

  function rankedImages(query, limit = 8) {
    const normalized = normalize(query);
    if (!normalized) return [];

    return images
      .map((image) => ({ image, score: imageMatchScore(image, normalized) }))
      .filter((item) => item.score > 0)
      .sort((first, second) => second.score - first.score || Number(first.image.id) - Number(second.image.id))
      .slice(0, limit)
      .map((item) => item.image);
  }

  function readableText(hex) {
    const rgb = rgbFromHex(hex);
    if (!rgb) return '#111111';
    const relative = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * relative[0] + 0.7152 * relative[1] + 0.0722 * relative[2];
    return luminance > 0.52 ? '#111111' : '#f7f7f4';
  }

  function activeSegment(input) {
    const value = input.value || '';
    const caret = input.selectionStart ?? value.length;
    let start = 0;
    let end = value.length;
    let match;

    CONNECTOR_PATTERN.lastIndex = 0;
    while ((match = CONNECTOR_PATTERN.exec(value))) {
      if (match.index < caret) start = CONNECTOR_PATTERN.lastIndex;
      if (match.index >= caret) {
        end = match.index;
        break;
      }
    }

    const segment = value.slice(start, end);
    return {
      start,
      end,
      query: segment.trim(),
      leading: segment.match(/^\s*/)?.[0] || '',
      trailing: segment.match(/\s*$/)?.[0] || '',
    };
  }

  function setExpanded(input, expanded) {
    input.setAttribute('aria-expanded', String(expanded));
  }

  function hide(field) {
    field.panel.hidden = true;
    field.activeIndex = -1;
    setExpanded(field.input, false);
    if (activeField === field) activeField = null;
  }

  function hideAll(except = null) {
    document.querySelectorAll('input[data-color-suggest]').forEach((input) => {
      const field = fields.get(input);
      if (field && field !== except) hide(field);
    });
  }

  function optionMarkup(image, index) {
    const name = colorName(image);
    const hex = cleanHex(image.hex);
    const hue = hueFromHex(hex);
    const meta = [image.id, hex, HUE_LABELS[hue] || '传统色', toneLabel(image)].filter(Boolean).join(' · ');
    return `
      <button class="color-suggest-option" type="button" role="option" data-color-suggest-index="${index}" style="--suggest-color: ${escapeHtml(hex)}; --suggest-ink: ${readableText(hex)}" aria-label="选择 ${escapeHtml(name)} ${escapeHtml(hex)}">
        <span class="color-suggest-effect" aria-hidden="true"></span>
        <span class="color-suggest-copy">
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(meta)}</small>
        </span>
      </button>
    `;
  }

  function setActiveOption(field, index) {
    const options = [...field.panel.querySelectorAll('[data-color-suggest-index]')];
    if (!options.length) {
      field.activeIndex = -1;
      field.input.removeAttribute('aria-activedescendant');
      return;
    }

    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const active = optionIndex === nextIndex;
      option.setAttribute('aria-selected', String(active));
      if (active) {
        option.id ||= `${field.panel.id}-option-${optionIndex}`;
        field.input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
    field.activeIndex = nextIndex;
  }

  function render(field) {
    const segment = activeSegment(field.input);
    const query = segment.query;

    if (!query) {
      hide(field);
      return;
    }

    const limit = Number.parseInt(field.input.dataset.colorSuggestLimit || '8', 10);
    const matches = rankedImages(query, Number.isFinite(limit) ? limit : 8);
    field.matches = matches;
    field.segment = segment;
    hideAll(field);

    field.panel.innerHTML = matches.length
      ? matches.map(optionMarkup).join('')
      : '<p class="color-suggest-empty">没有匹配的传统色</p>';
    field.panel.hidden = false;
    field.activeIndex = -1;
    activeField = field;
    setExpanded(field.input, true);
  }

  function pick(field, image) {
    if (!image) return;
    const segment = activeSegment(field.input);
    const value = field.input.value || '';
    const replacement = colorName(image);
    field.input.value = `${value.slice(0, segment.start)}${segment.leading}${replacement}${segment.trailing}${value.slice(segment.end)}`;
    field.input.focus();
    field.suppressRender = true;
    field.input.dispatchEvent(new CustomEvent('color-suggestion-pick', {
      bubbles: true,
      detail: {
        id: image.id,
        name: replacement,
        hex: cleanHex(image.hex),
        image,
      },
    }));
    field.input.dispatchEvent(new Event('input', { bubbles: true }));
    field.input.dispatchEvent(new Event('change', { bubbles: true }));
    field.suppressRender = false;
    hide(field);
  }

  function setup(input, index) {
    if (fields.has(input) || !images.length) return;

    const owner = input.closest('label') || input.parentElement;
    if (!owner) return;

    owner.classList.add('color-suggest-field');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('role', input.getAttribute('role') || 'combobox');

    const panel = document.createElement('div');
    panel.className = 'color-suggest-panel';
    panel.id = input.getAttribute('aria-controls') || `color-suggest-panel-${index + 1}`;
    panel.setAttribute('role', 'listbox');
    panel.hidden = true;
    input.setAttribute('aria-controls', panel.id);
    owner.append(panel);

    const field = { input, panel, matches: [], segment: null, activeIndex: -1, suppressRender: false };
    fields.set(input, field);

    input.addEventListener('input', () => {
      if (!field.suppressRender) render(field);
    });
    input.addEventListener('focus', () => render(field));
    input.addEventListener('keydown', (event) => {
      if (field.panel.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        hide(field);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveOption(field, field.activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveOption(field, field.activeIndex - 1);
      } else if (event.key === 'Enter' && field.activeIndex >= 0) {
        event.preventDefault();
        pick(field, field.matches[field.activeIndex]);
      }
    });
    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (document.activeElement && field.panel.contains(document.activeElement)) return;
        hide(field);
      }, 120);
    });

    panel.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    panel.addEventListener('click', (event) => {
      const option = event.target.closest('[data-color-suggest-index]');
      if (!option) return;
      pick(field, field.matches[Number(option.dataset.colorSuggestIndex)]);
    });
  }

  function init() {
    document.querySelectorAll('input[data-color-suggest]').forEach(setup);
  }

  document.addEventListener('pointerdown', (event) => {
    if (activeField && !activeField.panel.contains(event.target) && event.target !== activeField.input) {
      hide(activeField);
    }
  });

  window.ZH_COLOR_SEARCH = {
    colorName,
    fuzzySequenceScore,
    matchesImage,
    matchesText,
    rankedImages,
    searchableText,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
