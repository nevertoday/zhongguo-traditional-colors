(() => {
  const pages = [
    { key: 'home', label: '浏览色卡', href: 'index.html#gallery' },
    { key: 'explorer', label: '中国色浏览器', href: 'explorer.html' },
    { key: 'dictionary', label: '色彩字典', href: 'dictionary.html' },
    { key: 'style-lab', label: '场景试色', href: 'style-lab.html' },
    { key: 'generator', label: '配色生成', href: 'generator.html' },
    { key: 'theme-forge', label: '主题生成', href: 'theme-forge.html' },
    { key: 'terminal', label: '终端配色', href: 'terminal.html' },
    { key: 'palettes', label: '配色灵感', href: 'palettes.html' },
    { key: 'gradients', label: '渐变逻辑', href: 'gradients.html' },
    { key: 'uses', label: '用途卡片', href: 'uses.html' },
    { key: 'favorites', label: '收藏', href: 'favorites.html' },
    { key: 'skills', label: 'Skills', href: 'skills.html' },
  ];

  const brandHoverColors = [
    { name: '月白', hex: '#F9F4DC' },
    { name: '佛手黄', hex: '#FED71A' },
    { name: '香叶红', hex: '#F07C82' },
    { name: '银朱', hex: '#ED5126' },
    { name: '竹绿', hex: '#1BA784' },
    { name: '美蝶绿', hex: '#12AA9C' },
    { name: '晴山蓝', hex: '#8EC3E6' },
    { name: '釉蓝', hex: '#1781B5' },
    { name: '花青', hex: '#1661AB' },
    { name: '玫瑰紫', hex: '#BA2F7B' },
    { name: '绛紫', hex: '#8B2671' },
    { name: '枣红', hex: '#7C1823' },
    { name: '赭罗', hex: '#9A8878' },
    { name: '茶褐', hex: '#5C3719' },
    { name: '玛瑙灰', hex: '#CFCCC9' },
  ];

  const currentPage = document.body?.dataset.currentPage || pageKeyFromPath();
  // Pages served from a sub-directory (e.g. /colors/) set data-base="../" so the
  // shared header/footer links resolve back to the site root. Defaults to '' so
  // root-level pages render exactly as before.
  const base = document.body?.dataset.base || '';
  const sharedUtils = window.ZH_UTILS || {};

  sharedUtils.debounce ||= function debounce(fn, delay) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  };
  // Expose the brand palette so sub-pages (e.g. /colors/) can reuse it for the
  // footer spectrum instead of hard-coding their own divergent copy.
  sharedUtils.brandColors ||= brandHoverColors;
  window.ZH_UTILS = sharedUtils;

  function pageKeyFromPath() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'explorer.html') return 'explorer';
    if (path === 'dictionary.html') return 'dictionary';
    if (path === 'style-lab.html') return 'style-lab';
    if (path === 'generator.html') return 'generator';
    if (path === 'theme-forge.html') return 'theme-forge';
    if (path === 'terminal.html') return 'terminal';
    if (path === 'palettes.html') return 'palettes';
    if (path === 'gradients.html') return 'gradients';
    if (path === 'uses.html') return 'uses';
    if (path === 'favorites.html') return 'favorites';
    if (path === 'skills.html') return 'skills';
    return 'home';
  }

  function navHref(page) {
    if (currentPage === 'home' && page.key === 'home') return '#gallery';
    return base + page.href;
  }

  function navMarkup() {
    return pages.map((page) => {
      const current = page.key === currentPage ? ' aria-current="page"' : '';
      return `<a href="${navHref(page)}"${current}>${page.label}</a>`;
    }).join('');
  }

  function footerColorButtonsMarkup() {
    return Array.from({ length: 12 }, () => (
      '<button type="button" data-footer-color aria-label="复制随机传统色"></button>'
    )).join('');
  }

  function headerMarkup() {
    return `
    <header class="site-header">
      <a class="brand-mark" href="${base}index.html" aria-label="返回中国传统配色首页">
        <span>色</span>
        <strong>中国传统配色</strong>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="主导航">${navMarkup()}</nav>
      <div class="header-tools" aria-label="站点工具">
        <button class="nav-menu-toggle" type="button" data-nav-toggle aria-controls="site-nav" aria-expanded="false">
          <iconify-icon icon="lucide:menu" aria-hidden="true"></iconify-icon>
          <span class="sr-only">展开导航</span>
        </button>
        <a class="nav-icon-link" href="https://github.com/nevertoday/zhongguo-traditional-colors" target="_blank" rel="noopener" aria-label="新标签页打开 GitHub 仓库">
          <iconify-icon icon="simple-icons:github" aria-hidden="true"></iconify-icon>
        </a>
        <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">
          <iconify-icon icon="lucide:moon" data-theme-icon aria-hidden="true"></iconify-icon>
          <span class="sr-only" data-theme-label>暗色</span>
        </button>
      </div>
    </header>`;
  }

  function footerMarkup() {
    return `
    <footer class="site-footer">
      <div class="footer-main">
        <a class="footer-mark" href="${base}index.html" aria-label="返回中国传统配色首页">
          <span>色</span>
          <strong>中国传统配色</strong>
        </a>
        <p>开放色彩资料。生产前请校色。</p>
      </div>
      <div class="footer-spectrum-panel">
        <div class="footer-spectrum" aria-label="随机传统色色值，点击色块复制">${footerColorButtonsMarkup()}</div>
        <span class="footer-copy-toast" data-footer-copy-status aria-live="polite"></span>
      </div>
      <div class="footer-meta" aria-label="站点版本信息">
        <span>742 色入库</span>
        <span>Version 2026</span>
        <span>© 2026 xiaoxiaodong.ai</span>
      </div>
    </footer>`;
  }

  document.querySelector('[data-shared-header]')?.replaceWith(template(headerMarkup()));
  document.querySelector('[data-shared-footer]')?.replaceWith(template(footerMarkup()));
  bindBrandColorHover(document.querySelector('.brand-mark'));

  function template(markup) {
    const element = document.createElement('template');
    element.innerHTML = markup.trim();
    return element.content;
  }

  function rgbFromHex(hex) {
    const match = hex?.match(/^#?([0-9a-f]{6})$/i);
    if (!match) return null;
    const value = Number.parseInt(match[1], 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  function relativeLuminance(hex) {
    const rgb = rgbFromHex(hex);
    if (!rgb) return 0;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function randomBrandColors() {
    const pool = [...brandHoverColors];
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    return pool.slice(0, 3);
  }

  function setBrandHoverColors(brand) {
    const colors = randomBrandColors();
    const averageLuminance = colors.reduce((total, color) => total + relativeLuminance(color.hex), 0) / colors.length;
    brand.style.setProperty('--brand-hover-a', colors[0].hex);
    brand.style.setProperty('--brand-hover-b', colors[1].hex);
    brand.style.setProperty('--brand-hover-c', colors[2].hex);
    brand.style.setProperty('--brand-hover-ink', averageLuminance > 0.56 ? '#111111' : '#f7f7f4');
    brand.dataset.brandColors = colors.map((color) => `${color.name} ${color.hex}`).join(' / ');
  }

  function bindBrandColorHover(brand) {
    if (!brand) return;
    setBrandHoverColors(brand);
    brand.addEventListener('pointerenter', () => setBrandHoverColors(brand));
    brand.addEventListener('focus', () => setBrandHoverColors(brand));
  }
})();
