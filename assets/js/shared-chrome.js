(() => {
  const pages = [
    { key: 'home', label: '浏览色卡', href: 'index.html#gallery' },
    { key: 'style-lab', label: '场景试色', href: 'style-lab.html' },
    { key: 'generator', label: '配色生成', href: 'generator.html' },
    { key: 'palettes', label: '配色灵感', href: 'palettes.html' },
    { key: 'uses', label: '用途卡片', href: 'uses.html' },
    { key: 'skills', label: 'Skills', href: 'skills.html' },
  ];

  const currentPage = document.body?.dataset.currentPage || pageKeyFromPath();

  function pageKeyFromPath() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'style-lab.html') return 'style-lab';
    if (path === 'generator.html') return 'generator';
    if (path === 'palettes.html') return 'palettes';
    if (path === 'uses.html') return 'uses';
    if (path === 'skills.html') return 'skills';
    return 'home';
  }

  function navHref(page) {
    if (currentPage === 'home' && page.key === 'home') return '#gallery';
    return page.href;
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
      <a class="brand-mark" href="index.html" aria-label="返回中国传统配色首页">
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
        <a class="footer-mark" href="index.html" aria-label="返回中国传统配色首页">
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

  function template(markup) {
    const element = document.createElement('template');
    element.innerHTML = markup.trim();
    return element.content;
  }
})();
