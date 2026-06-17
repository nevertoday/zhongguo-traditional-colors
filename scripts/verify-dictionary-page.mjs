import { existsSync, readFileSync } from 'node:fs';

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (!existsSync('dictionary.html')) {
  fail('dictionary.html: missing color dictionary page');
} else {
  const source = readFileSync('dictionary.html', 'utf8');
  const requiredTokens = [
    'data-current-page="dictionary"',
    'data-shared-header',
    'data-shared-footer',
    'assets/data/images.js',
    'assets/data/harmonies.js',
    'assets/js/dictionary.js',
    'data-dictionary-grid',
    'data-dictionary-color-story',
    'data-color-detail-dialog',
  ];

  for (const token of requiredTokens) {
    if (!source.includes(token)) fail(`dictionary.html: missing ${token}`);
  }
}

const sharedChrome = readFileSync('assets/js/shared-chrome.js', 'utf8');
if (!sharedChrome.includes("key: 'dictionary'")) {
  fail('shared chrome: missing dictionary nav key');
}
if (!sharedChrome.includes("label: '色彩字典'")) {
  fail('shared chrome: missing dictionary nav label');
}
if (!sharedChrome.includes("dictionary.html")) {
  fail('shared chrome: missing dictionary href');
}

if (!existsSync('assets/js/dictionary.js')) {
  fail('assets/js/dictionary.js: missing dictionary behavior');
} else {
  const script = readFileSync('assets/js/dictionary.js', 'utf8');
  const requiredScriptTokens = [
    'TRADITIONAL_COLOR_IMAGES',
    'TRADITIONAL_COLOR_HARMONIES',
    'renderDictionary',
    'openColorDetail',
    'renderColorStory',
    'dictionary.html?q=',
    'copyColorValue',
    'data-color-card',
  ];

  for (const token of requiredScriptTokens) {
    if (!script.includes(token)) fail(`assets/js/dictionary.js: missing ${token}`);
  }
}

if (!process.exitCode) {
  console.log('Color dictionary page verified.');
}
