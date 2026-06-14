/*
 * Behavior for the per-color static pages under /colors/.
 * Wires the shared theme toggle, mobile nav toggle, color-value copy buttons,
 * and the footer color spectrum, reusing the same mechanisms as the other pages
 * (data-nav-open on the header, --spectrum-color on footer buttons, the shared
 * footer copy-status element, and the brand palette exposed by shared-chrome).
 * Kept self-contained so the color pages render fully without JS; this only adds
 * interactivity.
 */
(() => {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const themeLabel = document.querySelector('[data-theme-label]');
  const themeColorMeta = document.querySelector('[data-theme-color]');
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const siteNav = document.getElementById('site-nav');
  const footerColorButtons = document.querySelectorAll('[data-footer-color]');
  const footerCopyStatus = document.querySelector('[data-footer-copy-status]');
  const toast = document.querySelector('[data-toast]');

  // Reuse the brand palette from shared-chrome.js (single source of truth).
  const brandColors = window.ZH_UTILS?.brandColors || [];

  async function writeClipboard(value) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
      return true;
    } catch (error) {
      return false;
    }
  }

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
  }

  // Theme toggle (mirrors the pattern used across the other pages).
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      /* storage may be unavailable; ignore */
    }
    const isDark = theme === 'dark';
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    themeToggle?.setAttribute('aria-label', isDark ? '切换到亮色模式' : '切换到暗色模式');
    if (themeIcon) themeIcon.setAttribute('icon', isDark ? 'lucide:sun' : 'lucide:moon');
    if (themeLabel) themeLabel.textContent = isDark ? '亮色' : '暗色';
    if (themeColorMeta) themeColorMeta.setAttribute('content', isDark ? '#11100e' : '#f7f7f4');
  }

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  themeToggle?.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // Mobile nav toggle — uses the shared data-nav-open mechanism on the header.
  function setMobileNavOpen(open) {
    if (!siteHeader || !navToggle) return;
    siteHeader.dataset.navOpen = String(open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('iconify-icon')?.setAttribute('icon', open ? 'lucide:x' : 'lucide:menu');
  }

  navToggle?.addEventListener('click', () => {
    setMobileNavOpen(siteHeader?.dataset.navOpen !== 'true');
  });
  siteNav?.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) setMobileNavOpen(false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileNavOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 721px)').matches) setMobileNavOpen(false);
  });

  // Color-value copy buttons.
  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue || '';
      showToast(await writeClipboard(value) ? `已复制 ${value}` : '复制失败，请手动选择');
    });
  });

  // Footer color spectrum (matches the shared footer styling + copy-status flow).
  let footerCopyTimer;
  footerColorButtons.forEach((button, index) => {
    const color = brandColors[index % brandColors.length];
    if (!color) return;
    const copyText = `${color.name} ${color.hex}`;
    button.style.setProperty('--spectrum-color', color.hex);
    button.style.setProperty('--spectrum-index', String((index % 9) + 1));
    button.dataset.footerCopyValue = copyText;
    button.title = `复制 ${copyText}`;
    button.setAttribute('aria-label', `复制 ${color.name} 色值 ${color.hex}`);
    button.addEventListener('click', async () => {
      if (!(await writeClipboard(copyText))) return;
      if (!footerCopyStatus) return;
      window.clearTimeout(footerCopyTimer);
      footerCopyStatus.textContent = `已复制：${copyText}`;
      footerCopyStatus.dataset.visible = 'true';
      footerCopyTimer = window.setTimeout(() => {
        footerCopyStatus.dataset.visible = 'false';
      }, 1500);
    });
  });
})();
