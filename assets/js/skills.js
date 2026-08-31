const skillItems = [...document.querySelectorAll('.skill-item')];
const skillToggleButtons = [...document.querySelectorAll('[data-skill-toggle]')];
const skillAnchorLinks = [...document.querySelectorAll('[data-skill-anchor]')];

function headerOffset() {
  return (document.querySelector('.site-header')?.getBoundingClientRect().height || 0) + 12;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setSkillOpen(item, open) {
  if (!item) return;

  item.dataset.open = String(open);
  const button = item.querySelector('[data-skill-toggle]');
  const label = item.querySelector('[data-skill-toggle-label]');
  const detail = item.querySelector('.skill-detail');

  button?.setAttribute('aria-expanded', String(open));
  if (label) label.textContent = open ? '收起说明' : '展开说明';
  if (detail) {
    detail.setAttribute('aria-hidden', String(!open));
    detail.inert = !open;
  }
}

function closeSkillItems(except) {
  skillItems.forEach((item) => {
    if (item !== except && item.dataset.open === 'true') setSkillOpen(item, false);
  });
}

function scrollToSkillItem(item) {
  window.requestAnimationFrame(() => {
    const top = Math.max(0, item.getBoundingClientRect().top + window.scrollY - headerOffset());
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    item.querySelector('[data-skill-toggle]')?.focus({ preventScroll: true });
  });
}

function openSkillFromHash() {
  const id = window.location.hash.slice(1);
  if (!id.startsWith('skill-')) {
    if (id === 'skills') closeSkillItems();
    return;
  }

  const item = document.getElementById(id);
  if (!item?.classList.contains('skill-item')) return;

  closeSkillItems(item);
  setSkillOpen(item, true);
  scrollToSkillItem(item);
}

skillItems.forEach((item) => setSkillOpen(item, false));

skillToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.skill-item');
    const shouldOpen = item?.dataset.open !== 'true';
    if (shouldOpen) closeSkillItems(item);
    setSkillOpen(item, shouldOpen);
  });
});

skillAnchorLinks.forEach((link) => {
  link.addEventListener('click', () => window.setTimeout(openSkillFromHash, 0));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const item = document.activeElement?.closest?.('.skill-item[data-open="true"]');
  if (!item) return;

  event.preventDefault();
  setSkillOpen(item, false);
  item.querySelector('[data-skill-toggle]')?.focus();
});

window.addEventListener('hashchange', openSkillFromHash);
openSkillFromHash();
