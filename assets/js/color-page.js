/*
 * Behavior for the per-color static pages under /colors/.
 * Wires the color-value copy buttons. Shared theme, navigation, and footer
 * behavior is owned by shared-chrome.js so every page follows one interaction
 * contract without duplicate listeners or a second footer render.
 * Kept self-contained so the color pages render fully without JS; this only adds
 * interactivity.
 */
(() => {
  const toast = document.querySelector('[data-toast]');

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

  // Color-value copy buttons.
  document.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue || '';
      showToast(await writeClipboard(value) ? `已复制 ${value}` : '复制失败，请手动选择');
    });
  });
})();
