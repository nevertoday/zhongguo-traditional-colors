(() => {
  const images = Array.isArray(window.TRADITIONAL_COLOR_IMAGES) ? window.TRADITIONAL_COLOR_IMAGES : [];
  const harmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
  const board = document.querySelector('[data-generator-board]');
  const searchInput = document.querySelector('[data-generator-search]');
  const hint = document.querySelector('[data-generator-hint]');
  const toast = document.querySelector('[data-generator-toast]');
  const colorDialog = document.querySelector('[data-color-dialog]');
  const colorDialogTitle = document.querySelector('[data-color-dialog-title]');
  const colorDialogSearch = document.querySelector('[data-color-dialog-search]');
  const colorDialogGrid = document.querySelector('[data-color-dialog-grid]');
  const viewDialog = document.querySelector('[data-view-dialog]');
  const viewBody = document.querySelector('[data-view-body]');
  const exportDialog = document.querySelector('[data-export-dialog]');
  const methodButtons = [...document.querySelectorAll('[data-method]')];
  const recommendTabs = [...document.querySelectorAll('[data-recommend-tab]')];
  const roles = ['主色', '辅助', '过渡', '沉稳', '文字'];
  const methodLabels = {
    auto: '自动',
    analogous: '近似',
    complementary: '对比',
    triadic: '三分',
    neutral: '中性',
  };

  const colors = images.map((item) => ({
    ...item,
    name: colorName(item),
    cleanHex: normalizeHex(item.hex),
  })).filter((item) => item.cleanHex);

  const colorById = new Map(colors.map((item) => [item.id, item]));
  const colorByHex = new Map(colors.map((item) => [item.cleanHex, item]));
  let palette = [];
  let locked = [false, false, false, false, false];
  let method = 'auto';
  let activeColorIndex = 0;
  let activeRecommendTab = 'same';
  let toastTimer = 0;

  if (!board || !colors.length) return;

  init();

  function init() {
    bindEvents();
    palette = paletteFromUrl() || buildPalette(randomColor().id, method);
    render();
    updateUrl();
  }

  function bindEvents() {
    document.querySelector('[data-generator-generate]')?.addEventListener('click', () => generate());
    document.querySelector('[data-copy-palette]')?.addEventListener('click', () => copyExport('text'));
    document.querySelector('[data-generator-rotate]')?.addEventListener('click', rotatePalette);
    document.querySelector('[data-generator-reverse]')?.addEventListener('click', reversePalette);
    document.querySelector('[data-generator-unlock]')?.addEventListener('click', unlockAll);
    document.querySelector('[data-generator-view]')?.addEventListener('click', openView);
    document.querySelector('[data-generator-export]')?.addEventListener('click', () => exportDialog?.showModal());

    methodButtons.forEach((button) => {
      button.addEventListener('click', () => {
        method = button.dataset.method || 'auto';
        methodButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        generate(anchorFromSearch() || palette[0]?.id || randomColor().id);
      });
    });

    recommendTabs.forEach((button) => {
      button.addEventListener('click', () => {
        activeRecommendTab = button.dataset.recommendTab || 'same';
        recommendTabs.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        renderColorDialog();
      });
    });

    searchInput?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const anchor = anchorFromSearch();
      if (!anchor) {
        showToast('没有找到这个中国色');
        return;
      }
      generate(anchor);
    });

    colorDialogSearch?.addEventListener('input', renderColorDialog);

    exportDialog?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-export-kind]');
      if (!button) return;
      copyExport(button.dataset.exportKind || 'text');
      exportDialog.close();
    });

    document.addEventListener('keydown', (event) => {
      const editable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
      if (event.code === 'Space' && !editable && !isDialogOpen()) {
        event.preventDefault();
        generate();
      }
    });
  }

  function render() {
    board.innerHTML = palette.map((color, index) => colorTile(color, index)).join('');
    board.querySelectorAll('[data-copy-color]').forEach((button) => {
      button.addEventListener('click', () => copyColor(Number(button.dataset.copyColor)));
    });
    board.querySelectorAll('[data-lock-color]').forEach((button) => {
      button.addEventListener('click', () => toggleLock(Number(button.dataset.lockColor)));
    });
    board.querySelectorAll('[data-replace-color]').forEach((button) => {
      button.addEventListener('click', () => openColorDialog(Number(button.dataset.replaceColor)));
    });
    board.querySelectorAll('[data-suggest-color]').forEach((button) => {
      button.addEventListener('click', () => pickInlineSuggestion(button));
    });
    updateHint();
  }

  function colorTile(color, index) {
    const textColor = readableText(color.cleanHex);
    const rgb = hexToRgb(color.cleanHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const suggestions = inlineSuggestions(color.id, index);
    return `
      <article class="generator-color" style="background:${color.cleanHex}; --tile-text:${textColor}" data-locked="${locked[index]}" aria-label="${escapeHtml(color.name)} ${color.cleanHex}">
        <span class="generator-index">${String(index + 1).padStart(2, '0')}</span>
        <div class="generator-color-tools" aria-label="${escapeHtml(color.name)} 操作">
          <button type="button" data-copy-color="${index}" aria-label="复制 ${escapeHtml(color.name)}">
            <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          </button>
          <button type="button" data-lock-color="${index}" aria-label="${locked[index] ? '解锁' : '锁定'} ${escapeHtml(color.name)}">
            <iconify-icon icon="${locked[index] ? 'lucide:lock' : 'lucide:unlock'}" aria-hidden="true"></iconify-icon>
          </button>
          <button type="button" data-replace-color="${index}" aria-label="替换 ${escapeHtml(color.name)}">
            <iconify-icon icon="lucide:refresh-cw" aria-hidden="true"></iconify-icon>
          </button>
        </div>
        <div class="generator-color-main">
          <strong class="generator-hex">${color.cleanHex.replace('#', '')}</strong>
          <span class="generator-name">${escapeHtml(color.name)}</span>
          <span class="generator-value">RGB ${rgb.r} ${rgb.g} ${rgb.b}</span>
          <span class="generator-value">HSL ${hsl.h} ${hsl.s} ${hsl.l}</span>
        </div>
        <div class="generator-suggestions" aria-label="${escapeHtml(color.name)} 推荐替换">
          ${suggestions.map((suggestion) => `
            <button type="button" style="background:${suggestion.cleanHex}" data-suggest-color="${suggestion.id}" data-suggest-index="${index}" aria-label="替换为 ${escapeHtml(suggestion.name)}"></button>
          `).join('')}
        </div>
        <span class="generator-role">${roles[index]}</span>
      </article>
    `;
  }

  function generate(anchorId = anchorFromSearch()) {
    if (locked.every(Boolean)) {
      showToast('5 个颜色都已锁定');
      return;
    }
    const anchor = anchorId || randomColor().id;
    palette = buildPalette(anchor, method, palette, locked);
    render();
    updateUrl();
  }

  function buildPalette(anchorId, nextMethod, previous = [], lockedState = []) {
    const anchor = colorById.get(anchorId) || randomColor();
    const lockedIds = new Set(previous.filter((_, index) => lockedState[index]).map((item) => item.id));
    const candidates = candidateIds(anchor.id, nextMethod).filter((id) => colorById.has(id));
    const sequence = uniqueIds([anchor.id, ...candidates, ...shuffle(colors.map((item) => item.id))])
      .filter((id) => !lockedIds.has(id));
    let cursor = 0;

    return roles.map((_, index) => {
      if (lockedState[index] && previous[index]) return previous[index];
      const id = sequence[cursor] || randomColor().id;
      cursor += 1;
      return colorById.get(id) || randomColor();
    });
  }

  function candidateIds(anchorId, nextMethod) {
    const harmony = harmonies[anchorId] || {};
    if (nextMethod === 'analogous') {
      return [...ids(harmony.same), ...ids(harmony.analogous), ...ids(harmony.lighter), ...ids(harmony.darker)];
    }
    if (nextMethod === 'complementary') {
      return [...ids(harmony.complementary), ...ids(harmony.splitComplementary), ...ids(harmony.neutral)];
    }
    if (nextMethod === 'triadic') {
      return [...ids(harmony.triadic), ...ids(harmony.tetradic), ...ids(harmony.accent)];
    }
    if (nextMethod === 'neutral') {
      return [...ids(harmony.neutral), ...ids(harmony.grayTone), ...ids(harmony.same)];
    }
    return [
      ...ids(harmony.same).slice(0, 1),
      ...ids(harmony.analogous).slice(0, 1),
      ...ids(harmony.neutral).slice(0, 1),
      ...ids(harmony.accent),
      ...ids(harmony.temperatureContrast).slice(0, 1),
      ...ids(harmony.darker).slice(0, 1),
    ];
  }

  function inlineSuggestions(anchorId, index) {
    const harmony = harmonies[anchorId] || {};
    const relation = [
      ...ids(harmony.same).slice(0, 1),
      ...ids(harmony.lighter).slice(0, 1),
      ...ids(harmony.darker).slice(0, 1),
      ...ids(harmony.accent).slice(0, 1),
      ...ids(harmony.complementary).slice(0, 1),
      ...candidateIds(anchorId, method),
    ];
    const used = new Set(palette.map((item, itemIndex) => (itemIndex === index ? null : item.id)).filter(Boolean));
    return uniqueIds(relation)
      .filter((id) => !used.has(id) && id !== anchorId)
      .map((id) => colorById.get(id))
      .filter(Boolean)
      .slice(0, 5);
  }

  function openColorDialog(index) {
    activeColorIndex = index;
    activeRecommendTab = 'same';
    recommendTabs.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.recommendTab === activeRecommendTab)));
    if (colorDialogTitle) colorDialogTitle.textContent = `替换 ${palette[index].name}`;
    if (colorDialogSearch) colorDialogSearch.value = '';
    renderColorDialog();
    colorDialog?.showModal();
  }

  function renderColorDialog() {
    if (!colorDialogGrid) return;
    const current = palette[activeColorIndex];
    const query = normalizeQuery(colorDialogSearch?.value || '');
    const harmony = harmonies[current?.id] || {};
    let list = [];

    if (query) {
      list = colors.filter((color) => searchableText(color).includes(query)).slice(0, 48);
    } else {
      const relation = activeRecommendTab === 'accent'
        ? [...ids(harmony.accent), ...ids(harmony.complementary), ...ids(harmony.temperatureContrast)]
        : ids(harmony[activeRecommendTab]);
      list = uniqueIds([...relation, ...candidateIds(current.id, method)])
        .map((id) => colorById.get(id))
        .filter(Boolean)
        .slice(0, 36);
    }

    if (!list.length) {
      colorDialogGrid.innerHTML = '<p class="generator-empty">没有找到推荐色</p>';
      return;
    }

    colorDialogGrid.innerHTML = list.map((color) => `
      <button type="button" class="generator-recommend-card" data-pick-color="${color.id}">
        <span class="generator-recommend-swatch" style="background:${color.cleanHex}"></span>
        <span>
          <strong>${escapeHtml(color.name)}</strong>
          <span>${color.id} · ${color.cleanHex}</span>
        </span>
      </button>
    `).join('');

    colorDialogGrid.querySelectorAll('[data-pick-color]').forEach((button) => {
      button.addEventListener('click', () => {
        const color = colorById.get(button.dataset.pickColor);
        if (!color) return;
        palette[activeColorIndex] = color;
        render();
        updateUrl();
        colorDialog.close();
        showToast(`已替换为 ${color.name}`);
      });
    });
  }

  function openView() {
    if (!viewBody) return;
    viewBody.innerHTML = palette.map((color, index) => {
      const rgb = hexToRgb(color.cleanHex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `
        <div class="generator-view-row">
          <span class="generator-view-swatch" style="background:${color.cleanHex}"></span>
          <span>
            <strong>${roles[index]} · ${escapeHtml(color.name)}</strong>
            <span>${color.id} / ${color.cleanHex} / RGB ${rgb.r}, ${rgb.g}, ${rgb.b} / HSL ${hsl.h}, ${hsl.s}, ${hsl.l}</span>
          </span>
        </div>
      `;
    }).join('');
    viewDialog?.showModal();
  }

  function copyColor(index) {
    const color = palette[index];
    copyText(`${color.name} ${color.cleanHex}`);
    showToast(`已复制 ${color.name}`);
  }

  function toggleLock(index) {
    locked[index] = !locked[index];
    render();
    showToast(`${locked[index] ? '已锁定' : '已解锁'} ${palette[index].name}`);
  }

  function rotatePalette() {
    palette = [...palette.slice(1), palette[0]];
    locked = [...locked.slice(1), locked[0]];
    render();
    updateUrl();
    showToast('已轮换配色顺序');
  }

  function reversePalette() {
    palette = [...palette].reverse();
    locked = [...locked].reverse();
    render();
    updateUrl();
    showToast('已反转配色顺序');
  }

  function unlockAll() {
    if (!locked.some(Boolean)) {
      showToast('当前没有锁定颜色');
      return;
    }
    locked = locked.map(() => false);
    render();
    showToast('已解锁全部颜色');
  }

  function pickInlineSuggestion(button) {
    const index = Number(button.dataset.suggestIndex);
    const color = colorById.get(button.dataset.suggestColor);
    if (!color || Number.isNaN(index)) return;
    palette[index] = color;
    render();
    updateUrl();
    showToast(`已替换为 ${color.name}`);
  }

  function copyExport(kind) {
    const payload = exportPayload(kind);
    copyText(payload);
    showToast(kind === 'url' ? '已复制链接' : '已复制方案');
  }

  function exportPayload(kind) {
    const hexes = palette.map((color) => color.cleanHex);
    if (kind === 'css') {
      return `:root {\n${palette.map((color, index) => `  --zh-color-${index + 1}: ${color.cleanHex}; /* ${color.name} */`).join('\n')}\n}`;
    }
    if (kind === 'json') {
      return JSON.stringify(palette.map((color, index) => ({
        role: roles[index],
        id: color.id,
        name: color.name,
        hex: color.cleanHex,
      })), null, 2);
    }
    if (kind === 'url') {
      return `${location.origin}${location.pathname}?colors=${hexes.map((hex) => hex.replace('#', '')).join('-')}&method=${method}`;
    }
    return palette.map((color, index) => `${roles[index]}：${color.name} ${color.cleanHex}`).join('\n');
  }

  function paletteFromUrl() {
    const params = new URLSearchParams(location.search);
    const nextMethod = params.get('method');
    if (nextMethod && methodLabels[nextMethod]) {
      method = nextMethod;
      methodButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.method === method)));
    }

    const rawColors = (params.get('colors') || '').split('-').map((item) => normalizeHex(item)).filter(Boolean);
    const matched = rawColors.map((hex) => colorByHex.get(hex)).filter(Boolean);
    if (!matched.length) return null;
    return roles.map((_, index) => matched[index] || buildPalette(matched[0].id, method)[index]);
  }

  function updateUrl() {
    const colorsParam = palette.map((color) => color.cleanHex.replace('#', '')).join('-');
    const url = `${location.pathname}?colors=${colorsParam}&method=${method}`;
    history.replaceState(null, '', url);
  }

  function updateHint() {
    const lockedCount = locked.filter(Boolean).length;
    const first = palette[0];
    if (!hint || !first) return;
    hint.textContent = `${methodLabels[method]}生成 · 起点 ${first.name} · ${lockedCount ? `已锁定 ${lockedCount} 色` : '按空格生成新方案'}`;
  }

  function anchorFromSearch() {
    const query = normalizeQuery(searchInput?.value || '');
    if (!query) return null;
    const exactHex = normalizeHex(query);
    if (exactHex && colorByHex.has(exactHex)) return colorByHex.get(exactHex).id;
    const match = colors.find((color) => searchableText(color).includes(query));
    return match?.id || null;
  }

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function ids(value) {
    return Array.isArray(value) ? value : [];
  }

  function uniqueIds(value) {
    return [...new Set(value.filter(Boolean))];
  }

  function shuffle(value) {
    return [...value].sort(() => Math.random() - 0.5);
  }

  function colorName(item) {
    return (item.file || '')
      .replace(/\.png$/i, '')
      .replace(/^\d+-/, '')
      .trim() || item.id;
  }

  function normalizeHex(value) {
    const match = String(value || '').trim().match(/^#?([0-9a-f]{6})$/i);
    return match ? `#${match[1].toUpperCase()}` : '';
  }

  function normalizeQuery(value) {
    return String(value || '').trim().replace(/^#/, '').toLowerCase();
  }

  function searchableText(color) {
    return `${color.id} ${color.name} ${color.cleanHex} ${color.cleanHex.replace('#', '')}`.toLowerCase();
  }

  function readableText(hex) {
    const { r, g, b } = hexToRgb(hex);
    const linear = [r, g, b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
    return luminance > 0.52 ? '#111111' : '#f7f7f4';
  }

  function hexToRgb(hex) {
    const clean = normalizeHex(hex).replace('#', '');
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === r) h = ((g - b) / delta) + (g < b ? 6 : 0);
      if (max === g) h = ((b - r) / delta) + 2;
      if (max === b) h = ((r - g) / delta) + 4;
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      return;
    }
    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.visible = 'true';
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.dataset.visible = 'false';
    }, 1700);
  }

  function isDialogOpen() {
    return Boolean(document.querySelector('dialog[open]'));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }
})();
