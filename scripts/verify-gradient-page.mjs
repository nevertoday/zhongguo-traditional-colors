import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function fail(message) {
  failures.push(message);
}

if (!existsSync('gradients.html')) {
  fail('gradients.html: missing gradient logic page');
} else {
  const html = readFileSync('gradients.html', 'utf8');
  [
    'data-current-page="gradients"',
    'data-gradient-grid',
    'data-gradient-search',
    'data-color-suggest',
    'data-gradient-load-more',
    'assets/css/gradients.css',
    'assets/js/gradients.js',
    'assets/data/harmonies.js',
  ].forEach((token) => {
    if (!html.includes(token)) fail(`gradients.html: missing ${token}`);
  });
  if (html.includes('gradient-hero')) {
    fail('gradients.html: should not render the removed intro hero');
  }
}

if (!existsSync('assets/js/gradients.js')) {
  fail('assets/js/gradients.js: missing gradient page behavior');
} else {
  const script = readFileSync('assets/js/gradients.js', 'utf8');
  [
    'function gradientLogic',
    "relatedColor(anchor, ['lighter', 'grayTone', 'neutral']",
    "relatedColor(anchor, ['same', 'analogous', 'secondary']",
    "relatedColor(anchor, ['darker', 'accent', 'complementary']",
    'function cardMarkup',
    'function copyTextFor',
    'debounce(() => render({ reset: true }), 200)',
  ].forEach((token) => {
    if (!script.includes(token)) fail(`assets/js/gradients.js: missing ${token}`);
  });
}

if (!existsSync('assets/css/gradients.css')) {
  fail('assets/css/gradients.css: missing gradient page styles');
} else {
  const css = readFileSync('assets/css/gradients.css', 'utf8');
  [
    '.gradient-card',
    'aspect-ratio: 3 / 4;',
    'width: 100%;',
    'max-width: none;',
    '.gradient-tone-swatch',
    '.gradient-path-track',
    '.gradient-pair span',
    '@media (max-width: 480px)',
  ].forEach((token) => {
    if (!css.includes(token)) fail(`assets/css/gradients.css: missing ${token}`);
  });
  if (css.includes('.gradient-hero') || css.includes('.hero-dot')) {
    fail('assets/css/gradients.css: should not keep removed intro hero styles');
  }
  if (css.includes('box-shadow: inset 0 0 0')) {
    fail('assets/css/gradients.css: color circles should not use inset outlines');
  }
}

const sharedChrome = readFileSync('assets/js/shared-chrome.js', 'utf8');
[
  "key: 'gradients'",
  "label: '渐变逻辑'",
  "href: 'gradients.html'",
  "if (path === 'gradients.html') return 'gradients';",
].forEach((token) => {
  if (!sharedChrome.includes(token)) fail(`shared chrome: missing ${token}`);
});

if (failures.length) {
  throw new Error(`Gradient page verification failed:\n${failures.join('\n')}`);
}

console.log('Gradient logic page verified.');
