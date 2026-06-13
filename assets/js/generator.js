(() => {
  const images = Array.isArray(window.TRADITIONAL_COLOR_IMAGES) ? window.TRADITIONAL_COLOR_IMAGES : [];
  const harmonies = window.TRADITIONAL_COLOR_HARMONIES || {};
  const board = document.querySelector('[data-generator-board]');
  const searchInput = document.querySelector('[data-generator-search]');
  const searchSuggestions = document.querySelector('[data-generator-search-suggestions]');
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
    document.querySelector('[data-generator-replace-all]')?.addEventListener('click', (event) => replaceWholePalette(event.currentTarget));
    document.querySelector('[data-generator-generate]')?.addEventListener('click', () => generate());
    document.querySelector('[data-copy-palette]')?.addEventListener('click', () => copyExport('text'));
    document.querySelector('[data-favorite-generator]')?.addEventListener('click', (event) => toggleGeneratorFavorite(event.currentTarget));
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

    searchInput?.addEventListener('input', renderSearchSuggestions);
    searchInput?.addEventListener('focus', renderSearchSuggestions);
    searchInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hideSearchSuggestions();
        return;
      }
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const anchor = anchorFromSearch();
      if (!anchor) {
        showToast('没有找到这个中国色');
        return;
      }
      hideSearchSuggestions();
      generate(anchor);
    });
    searchSuggestions?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-generator-search-pick]');
      if (!button) return;
      pickSearchSuggestion(button.dataset.generatorSearchPick);
    });
    document.addEventListener('click', (event) => {
      if (event.target.closest('.generator-search-wrap')) return;
      hideSearchSuggestions();
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

  function replaceWholePalette(button) {
    const currentIds = new Set(palette.map((color) => color.id));
    const anchorIds = replacementAnchorIds(currentIds);
    const anchorId = anchorIds[0] || randomColorNotIn(currentIds).id;
    palette = buildFreshPalette(anchorId, method, currentIds);
    locked = locked.map(() => false);
    render();
    updateUrl();
    setActionFeedback(button);
    showToast('已整组替换');
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

  function buildFreshPalette(anchorId, nextMethod, excludedIds = new Set()) {
    const anchor = colorById.get(anchorId) || randomColorNotIn(excludedIds);
    const relatedToCurrent = palette.flatMap((color) => candidateIds(color.id, nextMethod));
    const sequence = uniqueIds([
      anchor.id,
      ...candidateIds(anchor.id, nextMethod),
      ...relatedToCurrent,
      ...shuffle(colors.map((item) => item.id)),
    ]).filter((id) => colorById.has(id) && !excludedIds.has(id));
    const selected = new Set();
    let cursor = 0;

    return roles.map(() => {
      while (cursor < sequence.length && selected.has(sequence[cursor])) cursor += 1;
      const id = sequence[cursor] || randomColorNotIn(new Set([...excludedIds, ...selected])).id;
      selected.add(id);
      cursor += 1;
      return colorById.get(id) || randomColorNotIn(excludedIds);
    });
  }

  function replacementAnchorIds(currentIds) {
    return uniqueIds([
      ...shuffle(palette.flatMap((color) => [
        ...candidateIds(color.id, method),
        ...candidateIds(color.id, 'analogous'),
        ...candidateIds(color.id, 'complementary'),
        ...candidateIds(color.id, 'neutral'),
      ])),
      ...shuffle(colors.map((color) => color.id)),
    ]).filter((id) => colorById.has(id) && !currentIds.has(id));
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
      list = rankedColorMatches(query, 48);
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

  function renderSearchSuggestions() {
    if (!searchSuggestions || !searchInput) return;
    const query = normalizeQuery(searchInput.value);
    if (!query) {
      hideSearchSuggestions();
      return;
    }

    const matches = rankedColorMatches(query, 8);
    searchSuggestions.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
    searchSuggestions.innerHTML = matches.length
      ? matches.map((color) => `
        <button type="button" class="generator-search-option" data-generator-search-pick="${color.id}" style="--suggest-color:${color.cleanHex}; --suggest-ink:${readableText(color.cleanHex)}">
          <span class="generator-search-effect" aria-hidden="true"></span>
          <span class="generator-search-copy">
            <strong>${escapeHtml(color.name)}</strong>
            <small>${color.id} · ${color.cleanHex} · ${escapeHtml(searchEffectLabel(color))}</small>
          </span>
        </button>
      `).join('')
      : '<p class="generator-search-empty">没有匹配的传统色</p>';
  }

  function hideSearchSuggestions() {
    if (!searchSuggestions || !searchInput) return;
    searchSuggestions.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  }

  function pickSearchSuggestion(id) {
    const color = colorById.get(id);
    if (!color || !searchInput) return;
    searchInput.value = color.name;
    hideSearchSuggestions();
    generate(color.id);
    showToast(`已以 ${color.name} 为起点`);
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

  function setActionFeedback(button) {
    if (!button) return;
    window.clearTimeout(button._feedbackTimer);
    button.dataset.feedback = 'true';
    button._feedbackTimer = window.setTimeout(() => {
      delete button.dataset.feedback;
    }, 900);
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
    hint.textContent = `${methodLabels[method]}生成 · 起点 ${first.name} · ${lockedCount ? `已锁定 ${lockedCount} 色；生成保留，换整组清空` : '空格生成；换整组替换全部'}`;
    updateGeneratorFavoriteButton();
  }

  function generatorFavoriteId() {
    return `generator:${method}:${palette.map((color) => color.cleanHex.replace('#', '')).join('-')}`;
  }

  function generatorFavoriteItem() {
    return {
      id: generatorFavoriteId(),
      type: 'generator',
      title: `${methodLabels[method]}生成方案`,
      subtitle: palette.map((color) => color.name).join(' / '),
      colors: palette.map((color) => ({ name: color.name, hex: color.cleanHex })),
      href: exportPayload('url'),
      text: exportPayload('text'),
    };
  }

  function updateGeneratorFavoriteButton() {
    const button = document.querySelector('[data-favorite-generator]');
    if (!button || !window.ZH_FAVORITES || !palette.length) return;
    const active = window.ZH_FAVORITES.has(generatorFavoriteId());
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? '取消收藏当前生成方案' : '收藏当前生成方案');
    button.title = active ? '取消收藏当前生成方案' : '收藏当前生成方案';
    button.querySelector('iconify-icon')?.setAttribute('icon', 'lucide:heart');
  }

  function setGeneratorFavoriteFeedback(button, active) {
    if (!button) return;
    window.clearTimeout(button._favoriteTimer);
    button.dataset.feedback = 'true';
    button.querySelector('iconify-icon')?.setAttribute('icon', active ? 'lucide:check' : 'lucide:heart-off');
    button._favoriteTimer = window.setTimeout(() => {
      delete button.dataset.feedback;
      updateGeneratorFavoriteButton();
    }, 1300);
  }

  function toggleGeneratorFavorite(button) {
    if (!window.ZH_FAVORITES || !palette.length) return;
    const result = window.ZH_FAVORITES.toggle(generatorFavoriteItem());
    updateGeneratorFavoriteButton();
    setGeneratorFavoriteFeedback(button, result.active);
    showToast(result.active ? '已收藏生成方案' : '已取消收藏生成方案');
    button?.setAttribute('aria-pressed', String(result.active));
  }

  function anchorFromSearch() {
    const query = normalizeQuery(searchInput?.value || '');
    if (!query) return null;
    const exactHex = normalizeHex(query);
    if (exactHex && colorByHex.has(exactHex)) return colorByHex.get(exactHex).id;
    const match = rankedColorMatches(query, 1)[0];
    return match?.id || null;
  }

  function rankedColorMatches(query, limit = 8) {
    const normalized = normalizeQuery(query);
    if (!normalized) return [];
    const exactHex = normalizeHex(normalized);

    return colors
      .map((color) => ({
        color,
        score: colorMatchScore(color, normalized, exactHex),
      }))
      .filter((item) => item.score > 0)
      .sort((first, second) => second.score - first.score || Number(first.color.id) - Number(second.color.id))
      .slice(0, limit)
      .map((item) => item.color);
  }

  function colorMatchScore(color, query, exactHex) {
    const name = normalizeQuery(color.name);
    const id = normalizeQuery(color.id);
    const hex = color.cleanHex.replace('#', '').toLowerCase();
    const text = searchableText(color);

    if (exactHex && color.cleanHex === exactHex) return 1200;
    if (name === query || id === query || hex === query) return 1100;
    if (name.startsWith(query) || hex.startsWith(query) || id.startsWith(query)) return 880;
    if (name.includes(query)) return 760 - Math.max(0, name.indexOf(query));
    if (hex.includes(query) || id.includes(query)) return 660 - Math.max(0, text.indexOf(query));
    const fuzzyName = fuzzySequenceScore(name, query);
    if (fuzzyName) return 460 + fuzzyName;
    const fuzzyText = fuzzySequenceScore(text, query);
    return fuzzyText ? 260 + fuzzyText : 0;
  }

  function fuzzySequenceScore(text, query) {
    if (!text || !query) return 0;
    let cursor = 0;
    let firstIndex = -1;
    let lastIndex = -1;
    for (const character of query) {
      const index = text.indexOf(character, cursor);
      if (index === -1) return 0;
      if (firstIndex === -1) firstIndex = index;
      lastIndex = index;
      cursor = index + 1;
    }
    const spread = Math.max(1, lastIndex - firstIndex + 1);
    return Math.max(1, 180 - spread - firstIndex);
  }

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function randomColorNotIn(disallowed = new Set()) {
    const pool = colors.filter((color) => !disallowed.has(color.id));
    return pool[Math.floor(Math.random() * pool.length)] || randomColor();
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

  function searchEffectLabel(color) {
    const harmony = harmonies[color.id] || {};
    const rgb = hexToRgb(color.cleanHex);
    const hsl = harmony.hsl || rgbToHsl(rgb.r, rgb.g, rgb.b);
    const family = harmony.hueFamily || hueFamilyFromHsl(hsl);
    const tone = hsl.l >= 82 ? '高明度' : hsl.l <= 28 ? '低明度' : hsl.s >= 72 ? '高饱和' : hsl.s <= 18 ? '灰调' : '中明度';
    return [family, tone].filter(Boolean).join(' · ');
  }

  function hueFamilyFromHsl(hsl) {
    if (!hsl || hsl.s < 12) return '中性色';
    if (hsl.h < 15 || hsl.h >= 345) return '红色系';
    if (hsl.h < 45) return '橙色系';
    if (hsl.h < 75) return '黄色系';
    if (hsl.h < 155) return '绿色系';
    if (hsl.h < 195) return '青色系';
    if (hsl.h < 255) return '蓝色系';
    if (hsl.h < 315) return '紫色系';
    return '红色系';
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
