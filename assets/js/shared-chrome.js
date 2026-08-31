(() => {
  const pages = [
    { key: 'home', label: '浏览色卡', href: 'index.html#gallery' },
    { key: 'colors', label: '传统色大全', href: 'colors/index.html' },
    { key: 'explorer', label: '中国色浏览器', href: 'explorer.html' },
    { key: 'dictionary', label: '色彩字典', href: 'dictionary.html' },
    { key: 'style-lab', label: '场景试色', href: 'style-lab.html' },
    { key: 'generator', label: '配色生成', href: 'generator.html' },
    { key: 'theme-forge', label: '主题生成', href: 'theme-forge.html' },
    { key: 'terminal', label: '终端配色', href: 'terminal.html' },
    { key: 'palettes', label: '配色灵感', href: 'palettes.html' },
    { key: 'gradients', label: '渐变逻辑', href: 'gradients.html' },
    { key: 'uses', label: '用途卡片', href: 'uses.html' },
    { key: 'daily', label: '每日一色', href: 'daily-color-playground.html' },
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
  let footerCopyTimer;

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
  sharedUtils.copyText ||= writeClipboard;
  window.ZH_UTILS = sharedUtils;

  function pageKeyFromPath() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (window.location.pathname.includes('/colors/') && path === 'index.html') return 'colors';
    return pages.find((page) => page.href.split('#')[0] === path)?.key || 'home';
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

  function currentPageLabel() {
    return pages.find((page) => page.key === currentPage)?.label || '浏览色卡';
  }

  function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {
      // Theme still applies for this page when storage is unavailable.
    }

    const isDark = nextTheme === 'dark';
    const toggle = document.querySelector('[data-theme-toggle]');
    const icon = document.querySelector('[data-theme-icon]');
    const label = document.querySelector('[data-theme-label]');
    const themeColorMeta = document.querySelector('[data-theme-color]');
    toggle?.setAttribute('aria-pressed', String(isDark));
    toggle?.setAttribute('aria-label', isDark ? '切换到亮色模式' : '切换到暗色模式');
    icon?.setAttribute('icon', isDark ? 'lucide:sun' : 'lucide:moon');
    if (label) label.textContent = isDark ? '亮色' : '暗色';
    themeColorMeta?.setAttribute('content', isDark ? '#11100e' : '#f7f7f4');
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
      <a class="nav-current-chip" href="${navHref(pages.find((page) => page.key === currentPage) || pages[0])}" aria-label="当前页面：${currentPageLabel()}">
        ${currentPageLabel()}
      </a>
      <nav class="site-nav" id="site-nav" aria-label="主导航">${navMarkup()}</nav>
      <div class="header-tools" aria-label="站点工具">
        <button class="nav-menu-toggle" type="button" data-nav-toggle aria-controls="site-nav" aria-expanded="false" aria-label="展开导航">
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
        <nav class="footer-links" aria-label="底部导航">
          <a href="${base}colors/index.html">传统色大全</a>
          <a href="${base}dictionary.html">色彩字典</a>
          <a href="${base}llms.txt">LLMs.txt</a>
          <a href="${base}sitemap.xml">站点地图</a>
        </nav>
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
  bindSharedTheme();
  bindSharedNavigation();
  bindSharedFooter();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSharedFooterSpectrum, { once: true });
  } else {
    buildSharedFooterSpectrum();
  }

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

  function contrastRatio(firstLuminance, secondLuminance) {
    const lighter = Math.max(firstLuminance, secondLuminance);
    const darker = Math.min(firstLuminance, secondLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function minimumContrast(colors, ink) {
    const inkLuminance = relativeLuminance(ink);
    return colors.reduce((lowest, color) => (
      Math.min(lowest, contrastRatio(relativeLuminance(color.hex), inkLuminance))
    ), Number.POSITIVE_INFINITY);
  }

  function readableInkForColors(colors) {
    const darkInk = '#111111';
    const lightInk = '#f7f7f4';
    const darkContrast = minimumContrast(colors, darkInk);
    const lightContrast = minimumContrast(colors, lightInk);
    return darkContrast >= lightContrast
      ? { ink: darkInk, contrast: darkContrast }
      : { ink: lightInk, contrast: lightContrast };
  }

  function randomBrandColors() {
    let bestColors = brandHoverColors.slice(0, 3);
    let bestContrast = 0;

    for (let attempt = 0; attempt < 48; attempt += 1) {
      const colors = randomItems(brandHoverColors, 3);
      const { contrast } = readableInkForColors(colors);
      if (contrast > bestContrast) {
        bestColors = colors;
        bestContrast = contrast;
      }
      if (contrast >= 4.5) return colors;
    }

    return bestColors;
  }

  function setBrandHoverColors(brand) {
    const colors = randomBrandColors();
    const { ink } = readableInkForColors(colors);
    brand.style.setProperty('--brand-hover-a', colors[0].hex);
    brand.style.setProperty('--brand-hover-b', colors[1].hex);
    brand.style.setProperty('--brand-hover-c', colors[2].hex);
    brand.style.setProperty('--brand-hover-ink', ink);
    brand.dataset.brandColors = colors.map((color) => `${color.name} ${color.hex}`).join(' / ');
  }

  function bindBrandColorHover(brand) {
    if (!brand) return;
    setBrandHoverColors(brand);
    brand.addEventListener('pointerenter', () => setBrandHoverColors(brand));
    brand.addEventListener('focus', () => setBrandHoverColors(brand));
  }

  function bindSharedNavigation() {
    const header = document.querySelector('.site-header');
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('[data-nav-toggle]');
    if (!header || !nav || !toggle) return;

    const compactNav = () => window.matchMedia('(max-width: 1180px)').matches;
    const setOpen = (open) => {
      const nextOpen = compactNav() && open;
      header.dataset.navOpen = nextOpen ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', String(nextOpen));
      toggle.setAttribute('aria-label', nextOpen ? '收起导航' : '展开导航');
      const icon = toggle.querySelector('iconify-icon');
      if (icon) icon.setAttribute('icon', nextOpen ? 'lucide:x' : 'lucide:menu');
      if (compactNav()) {
        nav.toggleAttribute('inert', !nextOpen);
        nav.setAttribute('aria-hidden', String(!nextOpen));
      } else {
        nav.removeAttribute('inert');
        nav.removeAttribute('aria-hidden');
      }
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(header.dataset.navOpen !== 'true');
    }, { capture: true });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) setOpen(false);
    }, { capture: true });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.dataset.navOpen === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', sharedUtils.debounce(() => {
      setOpen(header.dataset.navOpen === 'true');
    }, 120));

    setOpen(false);
  }

  function bindSharedTheme() {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    setTheme(currentTheme());
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    }, { capture: true });

    sharedUtils.currentTheme = currentTheme;
    sharedUtils.setTheme = setTheme;
  }

  function colorName(color) {
    return color?.name || color?.zh || color?.title || color?.file?.replace(/^\d+-/, '').replace(/\.[^.]+$/, '') || '传统色';
  }

  function footerColors() {
    const colors = Array.isArray(window.TRADITIONAL_COLOR_IMAGES)
      ? window.TRADITIONAL_COLOR_IMAGES.filter((color) => color?.hex)
      : [];
    return colors.length ? colors : brandHoverColors;
  }

  function randomItems(items, count) {
    const pool = [...items];
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    return pool.slice(0, count);
  }

  function buildSharedFooterSpectrum() {
    const buttons = [...document.querySelectorAll('[data-footer-color]')];
    if (!buttons.length) return;

    const colors = randomItems(footerColors(), buttons.length);
    buttons.forEach((button, index) => {
      const color = colors[index % colors.length];
      const name = colorName(color);
      const hex = color.hex;
      const copyText = `${name} ${hex}`;
      button.style.setProperty('--spectrum-color', hex);
      button.style.setProperty('--spectrum-index', String((index % 9) + 1));
      button.dataset.footerCopyValue = copyText;
      button.title = `复制 ${copyText}`;
      button.setAttribute('aria-label', `复制 ${name} 色值 ${hex}`);
    });
  }

  async function writeClipboard(text) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Fall through to the selection-based copy path.
    }

    const textarea = document.createElement('textarea');
    try {
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      return document.execCommand('copy');
    } catch (error) {
      return false;
    } finally {
      textarea.remove();
    }
  }

  function bindSharedFooter() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    footer.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-footer-color]');
      if (!button) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const copyText = button.dataset.footerCopyValue;
      if (!copyText) return;

      const copied = await writeClipboard(copyText);
      if (copied) button.dataset.copied = 'true';
      const status = footer.querySelector('[data-footer-copy-status]');
      if (status) {
        window.clearTimeout(footerCopyTimer);
        status.textContent = copied ? `已复制：${copyText}` : '复制失败，请手动选择色值';
        status.dataset.visible = 'true';
        footerCopyTimer = window.setTimeout(() => {
          status.dataset.visible = 'false';
        }, 1600);
      }
      if (copied) {
        window.setTimeout(() => {
          delete button.dataset.copied;
        }, 1000);
      }
    }, { capture: true });
  }
})();
