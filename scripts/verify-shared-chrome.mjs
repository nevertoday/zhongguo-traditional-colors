import { readFileSync } from 'node:fs';

const pages = ['index.html', 'colors/index.html', 'explorer.html', 'dictionary.html', 'style-lab.html', 'generator.html', 'theme-forge.html', 'terminal.html', 'palettes.html', 'gradients.html', 'uses.html', 'favorites.html', 'skills.html'];
const pageKeys = {
  'index.html': 'home',
  'colors/index.html': 'colors',
  'explorer.html': 'explorer',
  'dictionary.html': 'dictionary',
  'style-lab.html': 'style-lab',
  'generator.html': 'generator',
  'theme-forge.html': 'theme-forge',
  'terminal.html': 'terminal',
  'palettes.html': 'palettes',
  'gradients.html': 'gradients',
  'uses.html': 'uses',
  'favorites.html': 'favorites',
  'skills.html': 'skills',
};
const pageScripts = {
  'index.html': 'assets/js/app.js',
  'colors/index.html': '',
  'explorer.html': 'assets/js/explorer.js',
  'dictionary.html': 'assets/js/dictionary.js',
  'style-lab.html': 'assets/js/app.js',
  'generator.html': 'assets/js/generator.js',
  'theme-forge.html': 'assets/js/theme-forge.js',
  'terminal.html': 'assets/js/terminal.js',
  'palettes.html': 'assets/js/palettes.js',
  'gradients.html': 'assets/js/gradients.js',
  'uses.html': 'assets/js/uses.js',
  'favorites.html': 'assets/js/favorites.js',
  'skills.html': 'assets/js/skills.js',
};
const expectedNavLabels = ['浏览色卡', '传统色大全', '中国色浏览器', '色彩字典', '场景试色', '配色生成', '主题生成', '终端配色', '配色灵感', '渐变逻辑', '用途卡片', '收藏', 'Skills'];
const sharedChrome = readFileSync('assets/js/shared-chrome.js', 'utf8');
const oldPaletteChrome = [
  'palette-header',
  'palette-brand',
  'palette-nav',
  'palette-tools',
  'palette-menu-toggle',
];
const sharedInteractionOwners = [
  ...new Set([...Object.values(pageScripts).filter(Boolean), 'assets/js/color-page.js']),
];
const legacySharedBindings = [
  "themeToggle?.addEventListener('click'",
  "navToggle?.addEventListener('click'",
  'buildFooterSpectrum();',
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

for (const page of pages) {
  const source = readFileSync(page, 'utf8');

  if (!source.includes('data-shared-header')) {
    fail(`${page}: missing shared header placeholder`);
  }
  if (!source.includes('data-shared-footer')) {
    fail(`${page}: missing shared footer placeholder`);
  }
  if (!source.includes('assets/js/shared-chrome.js')) {
    fail(`${page}: missing shared chrome script`);
  }
  if (!source.includes(`rel="preload" href="${page.startsWith('colors/') ? '../' : ''}assets/js/shared-chrome.js`)) {
    fail(`${page}: should preload shared chrome script`);
  }
  const sharedScriptIndex = source.indexOf('assets/js/shared-chrome.js');
  const pageScriptIndex = pageScripts[page] ? source.indexOf(pageScripts[page]) : -1;
  if (pageScripts[page] && pageScriptIndex === -1) {
    fail(`${page}: missing page script`);
  } else if (pageScriptIndex !== -1 && sharedScriptIndex > pageScriptIndex) {
    fail(`${page}: shared chrome script must load before page script`);
  }
  if (!source.includes(`data-current-page="${pageKeys[page]}"`)) {
    fail(`${page}: missing current page key ${pageKeys[page]}`);
  }
  if (source.includes('<header class="site-header">')) {
    fail(`${page}: should not inline site-header`);
  }
  if (source.includes('<footer class="site-footer">')) {
    fail(`${page}: should not inline site-footer`);
  }

  if (page === 'palettes.html') {
    for (const token of oldPaletteChrome) {
      if (source.includes(token)) fail(`${page}: still contains old ${token}`);
    }
  }
}

const labels = expectedNavLabels.filter((label) => sharedChrome.includes(`label: '${label}'`));
if (labels.join('|') !== expectedNavLabels.join('|')) {
  fail(`shared chrome nav labels differ: ${labels.join(' / ')}`);
}

if (!sharedChrome.includes('class="site-header"')) {
  fail('shared chrome missing site-header');
}
if (!sharedChrome.includes('class="site-nav" id="site-nav"')) {
  fail('shared chrome missing site-nav');
}
if (!sharedChrome.includes('data-theme-label')) {
  fail('shared chrome missing theme label');
}
if (!sharedChrome.includes('function bindSharedTheme()')) {
  fail('shared chrome should own theme interactions');
}
if (!sharedChrome.includes('class="site-footer"')) {
  fail('shared chrome missing site-footer');
}
if (!sharedChrome.includes('class="footer-links"')) {
  fail('shared chrome missing consistent footer links');
}
if (!sharedChrome.includes('href="${base}llms.txt"')) {
  fail('shared chrome footer should link llms.txt');
}
if (!sharedChrome.includes('Array.from({ length: 12 }')) {
  fail('shared chrome footer spectrum should render 12 color buttons');
}
if (!sharedChrome.includes('function buildSharedFooterSpectrum()')) {
  fail('shared chrome should own footer spectrum data binding');
}
if (!sharedChrome.includes('function bindSharedFooter()')) {
  fail('shared chrome should own footer copy interactions');
}
for (const token of [
  "window.matchMedia('(max-width: 1180px)')",
  "nav.toggleAttribute('inert', !nextOpen)",
  "nav.setAttribute('aria-hidden', String(!nextOpen))",
  "event.key === 'Escape' && header.dataset.navOpen === 'true'",
  'toggle.focus()',
]) {
  if (!sharedChrome.includes(token)) fail(`shared chrome navigation missing keyboard state behavior: ${token}`);
}
if (!sharedChrome.includes('const copied = await writeClipboard(copyText)')) {
  fail('shared chrome footer should wait for the real clipboard result');
}
if (!sharedChrome.includes("'复制失败，请手动选择色值'")) {
  fail('shared chrome footer should report clipboard failure');
}

for (const script of sharedInteractionOwners) {
  const source = readFileSync(script, 'utf8');
  for (const binding of legacySharedBindings) {
    if (source.includes(binding)) {
      fail(`${script}: shared theme, navigation, and footer interactions must remain owned by shared-chrome.js (${binding})`);
    }
  }
}

if (!process.exitCode) {
  console.log(`Shared chrome verified for ${pages.length} pages.`);
}
