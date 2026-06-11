import { readFileSync } from 'node:fs';

const app = readFileSync('assets/js/app.js', 'utf8');
const css = readFileSync('assets/css/styles.css', 'utf8');
const html = readFileSync('style-lab.html', 'utf8');

const requiredAppSnippets = [
  "size: '桌面首屏 / 1440x900'",
  "layout: '顶栏 / 左侧主张 / 右侧视觉 / CTA / 功能卡'",
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
  '.style-sample-web-hero',
  '.style-sample-slide-layout',
  '.style-sample-brand-board',
  '.style-sample-poster-info',
  '.style-sample-social-footer',
];

const requiredHtmlPatterns = [
  /<h1 id="style-lab-title">选中国色，看场景效果<\/h1>/,
  /选一个主色，切换网页、PPT、封面、海报和品牌预览。/,
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
