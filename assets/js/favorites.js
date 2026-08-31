const tabs = document.querySelector('[data-favorite-tabs]');
const grid = document.querySelector('[data-favorites-grid]');
const count = document.querySelector('[data-favorites-count]');
const clearButton = document.querySelector('[data-favorites-clear]');
const toast = document.querySelector('[data-toast]');

const TYPES = [
  { key: 'all', label: '全部' },
  { key: 'color', label: '色卡' },
  { key: 'palette', label: '配色' },
  { key: 'use', label: '用途' },
  { key: 'generator', label: '生成' },
  { key: 'style', label: '试色' },
];

let currentType = 'all';
let toastTimer = 0;
let clearConfirmTimer = 0;
let clearArmed = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function typeLabel(type) {
  return TYPES.find((item) => item.key === type)?.label || type;
}

function clearTargetLabel() {
  return currentType === 'all' ? '全部收藏' : `${typeLabel(currentType)}收藏`;
}

function resetClearConfirmation() {
  window.clearTimeout(clearConfirmTimer);
  clearConfirmTimer = 0;
  clearArmed = false;
  if (!clearButton) return;
  delete clearButton.dataset.confirming;
  clearButton.setAttribute('aria-label', `清空${clearTargetLabel()}`);
  clearButton.innerHTML = '<iconify-icon icon="lucide:trash-2" aria-hidden="true"></iconify-icon>清空当前类型';
}

function armClearConfirmation() {
  if (!clearButton) return;
  clearArmed = true;
  clearButton.dataset.confirming = 'true';
  clearButton.setAttribute('aria-label', `再次点击确认清空${clearTargetLabel()}`);
  clearButton.innerHTML = `<iconify-icon icon="lucide:triangle-alert" aria-hidden="true"></iconify-icon>确认清空${clearTargetLabel()}`;
  showToast(`再次点击确认清空${clearTargetLabel()}`);
  clearConfirmTimer = window.setTimeout(resetClearConfirmation, 4000);
}

function items() {
  const all = window.ZH_FAVORITES?.read() || [];
  return currentType === 'all' ? all : all.filter((item) => item.type === currentType);
}

function colorStrip(colors = []) {
  return colors.length
    ? `<div class="favorite-strip">${colors.map((color) => `<span style="--favorite-color:${escapeHtml(color.hex || color)}"></span>`).join('')}</div>`
    : '';
}

function itemMarkup(item) {
  const colors = Array.isArray(item.colors) ? item.colors : [];
  const href = item.href || '#';
  return `
    <article class="favorite-card" data-favorite-id="${escapeHtml(item.id)}">
      ${colorStrip(colors)}
      <div class="favorite-card-body">
        <span>${escapeHtml(typeLabel(item.type))}</span>
        <h2>${escapeHtml(item.title || '未命名收藏')}</h2>
        <p>${escapeHtml(item.subtitle || '')}</p>
      </div>
      <footer>
        <a href="${escapeHtml(href)}">打开</a>
        <button type="button" data-favorite-copy="${escapeHtml(item.id)}">
          <iconify-icon icon="lucide:copy" aria-hidden="true"></iconify-icon>
          复制
        </button>
        <button type="button" data-favorite-remove="${escapeHtml(item.id)}">
          <iconify-icon icon="lucide:x" aria-hidden="true"></iconify-icon>
          移除
        </button>
      </footer>
    </article>
  `;
}

function renderTabs() {
  if (!tabs) return;
  const all = window.ZH_FAVORITES?.read() || [];
  tabs.innerHTML = TYPES.map((type) => {
    const total = type.key === 'all' ? all.length : all.filter((item) => item.type === type.key).length;
    return `
      <button type="button" data-favorite-type="${escapeHtml(type.key)}" aria-pressed="${type.key === currentType ? 'true' : 'false'}">
        ${escapeHtml(type.label)}
        <span>${total}</span>
      </button>
    `;
  }).join('');
}

function render() {
  const visible = items();
  renderTabs();
  if (count) count.textContent = `${visible.length.toLocaleString('zh-CN')} 个收藏`;
  if (clearButton) clearButton.disabled = visible.length === 0;
  if (!grid) return;
  grid.innerHTML = visible.length
    ? visible.map(itemMarkup).join('')
    : '<div class="empty-state"><strong>还没有收藏</strong><span>在色卡、配色、用途、生成器或试色页面点击心形收藏。</span></div>';
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.append(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
}

function showToast(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = 'true';
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = 'false';
  }, 1500);
}

tabs?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-favorite-type]');
  if (!button) return;
  currentType = button.dataset.favoriteType || 'all';
  resetClearConfirmation();
  render();
});

grid?.addEventListener('click', async (event) => {
  const copyButton = event.target.closest('[data-favorite-copy]');
  if (copyButton) {
    const item = (window.ZH_FAVORITES?.read() || []).find((entry) => entry.id === copyButton.dataset.favoriteCopy);
    if (item) {
      await writeClipboard(item.text || `${item.title}\n${item.subtitle || ''}`);
      showToast('已复制收藏内容');
    }
    return;
  }

  const removeButton = event.target.closest('[data-favorite-remove]');
  if (removeButton) {
    window.ZH_FAVORITES?.remove(removeButton.dataset.favoriteRemove);
    showToast('已移除收藏');
    render();
  }
});

clearButton?.addEventListener('click', () => {
  if (!clearArmed) {
    armClearConfirmation();
    return;
  }

  const all = window.ZH_FAVORITES?.read() || [];
  const next = currentType === 'all' ? [] : all.filter((item) => item.type !== currentType);
  const target = clearTargetLabel();
  resetClearConfirmation();
  window.ZH_FAVORITES?.write(next);
  showToast(`已清空${target}`);
  render();
});

clearButton?.addEventListener('blur', () => {
  if (clearArmed) resetClearConfirmation();
});

clearButton?.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !clearArmed) return;
  event.preventDefault();
  resetClearConfirmation();
});

window.addEventListener('zh-favorites-change', render);
render();
