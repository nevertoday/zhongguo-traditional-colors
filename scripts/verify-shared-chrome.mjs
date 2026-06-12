import { readFileSync } from 'node:fs';

const pages = ['index.html', 'style-lab.html', 'generator.html', 'palettes.html', 'uses.html', 'skills.html'];
const pageKeys = {
  'index.html': 'home',
  'style-lab.html': 'style-lab',
  'generator.html': 'generator',
  'palettes.html': 'palettes',
  'uses.html': 'uses',
  'skills.html': 'skills',
};
const pageScripts = {
  'index.html': 'assets/js/app.js',
  'style-lab.html': 'assets/js/app.js',
  'generator.html': 'assets/js/generator.js',
  'palettes.html': 'assets/js/palettes.js',
  'uses.html': 'assets/js/uses.js',
  'skills.html': 'assets/js/app.js',
};
const expectedNavLabels = ['浏览色卡', '场景试色', '配色生成', '配色灵感', '用途卡片', 'Skills'];
const sharedChrome = readFileSync('assets/js/shared-chrome.js', 'utf8');
const oldPaletteChrome = [
  'palette-header',
  'palette-brand',
  'palette-nav',
  'palette-tools',
  'palette-menu-toggle',
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
  const sharedScriptIndex = source.indexOf('assets/js/shared-chrome.js');
  const pageScriptIndex = source.indexOf(pageScripts[page]);
  if (pageScriptIndex === -1) {
    fail(`${page}: missing page script`);
  } else if (sharedScriptIndex > pageScriptIndex) {
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
if (!sharedChrome.includes('class="site-footer"')) {
  fail('shared chrome missing site-footer');
}
if (!sharedChrome.includes('Array.from({ length: 12 }')) {
  fail('shared chrome footer spectrum should render 12 color buttons');
}

if (!process.exitCode) {
  console.log(`Shared chrome verified for ${pages.length} pages.`);
}
