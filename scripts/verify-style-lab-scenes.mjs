import { readFileSync } from 'node:fs';

const app = readFileSync('assets/js/app.js', 'utf8');
const css = readFileSync('assets/css/styles.css', 'utf8');
const html = readFileSync('style-lab.html', 'utf8');

const requiredAppSnippets = [
  "size: '桌面首屏 / 1440x900'",
  "layout: '顶栏 / 左侧主张 / 右侧视觉 / CTA / 功能卡'",
  'function styleLabSchemeForScene',
  'STYLE_LAB_SCENES',
  'styleTemplateMarkup(scene, sceneScheme)',
  'data-active="${selected ? \'true\' : \'false\'}"',
  'style-sample-web-hero',
  'style-sample-slide-layout',
  'style-sample-poster-info',
  'style-sample-brand-board',
  'style-sample-social-footer',
];

const requiredCssSnippets = [
  '--scene-preview-aspect: 16 / 10',
  '--scene-preview-aspect: 16 / 9',
  '--scene-preview-aspect: 3 / 4',
  '--scene-preview-aspect: 9 / 16',
  'position: fixed;',
  'bottom: 12px;',
  'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
  '.style-lab-meter-panel',
  '.style-lab-role-panel',
  '.style-template-card--scene[data-active="true"]',
  '.style-sample-web-hero',
  '.style-sample-slide-layout',
  '.style-sample-brand-board',
  '.style-sample-poster-info',
  '.style-sample-social-footer',
];

const requiredHtmlPatterns = [
  /class="style-lab-control style-lab-dock"/,
  /class="style-lab-meter-panel"/,
  /class="style-lab-role-panel"/,
  /<div class="style-template-grid" data-style-lab aria-label="传统色配色应用实验预览"><\/div>\s*<aside class="style-lab-control style-lab-dock"/,
  /assets\/css\/styles\.css\?v=\d{8}-\d+/,
  /assets\/js\/app\.js\?v=\d{8}-\d+/,
];

const missing = [
  ...requiredAppSnippets.filter((snippet) => !app.includes(snippet)).map((snippet) => `app.js: ${snippet}`),
  ...requiredCssSnippets.filter((snippet) => !css.includes(snippet)).map((snippet) => `styles.css: ${snippet}`),
  ...requiredHtmlPatterns.filter((pattern) => !pattern.test(html)).map((pattern) => `style-lab.html: ${pattern}`),
];

if (missing.length) {
  console.error(`style-lab scene verification failed:\n${missing.join('\n')}`);
  process.exit(1);
}

console.log('style-lab scene verification passed');
