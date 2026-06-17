/*
 * Verifies the integrity of the image manifest (assets/data/images.js) against
 * the canonical color list (docs/chinese-color-master-list.md).
 *
 * This guards the project's single source of truth: every downstream artifact
 * (harmonies, per-color SEO pages and their URLs, the README gallery) keys off
 * `image.id`, so a silently drifted id or a null hex would corrupt the whole
 * site. Run after build-manifest.mjs.
 *
 * Enforces the contract the README already promises:
 *   "图片文件统一按 NNN-颜色名.png 命名，编号与原始 742 色清单保持一致，一一对应。"
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = 'assets/data/images.js';
const MASTER_LIST = 'docs/chinese-color-master-list.md';

const failures = [];
const fail = (message) => failures.push(message);

function read(relPath) {
  return readFileSync(path.join(ROOT, relPath), 'utf8');
}

function loadBrowserData(relPath, key) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(read(relPath), sandbox, { filename: relPath });
  return sandbox.window[key];
}

function loadMasterList(relPath) {
  const entries = [];
  for (const line of read(relPath).split(/\r?\n/)) {
    const match = line.trim().match(/^(.+?)\s+(#[0-9A-Fa-f]{6})$/);
    if (match) entries.push({ name: match[1], hex: match[2].toUpperCase() });
  }
  return entries;
}

function colorNameFromFile(file) {
  return file.replace(/^\d{3}-/, '').replace(/\.[^.]+$/, '');
}

function cmykFromHex(hex) {
  const v = hex.replace('#', '');
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

const images = loadBrowserData(MANIFEST, 'TRADITIONAL_COLOR_IMAGES') || [];
const master = loadMasterList(MASTER_LIST);

if (!images.length) fail(`${MANIFEST}: no colors loaded — run \`npm run manifest\``);
if (!master.length) fail(`${MASTER_LIST}: no entries parsed`);

// 1. Count parity between manifest and master list.
if (images.length && master.length && images.length !== master.length) {
  fail(`count mismatch: ${images.length} images vs ${master.length} master-list entries`);
}

// 2. Per-image integrity.
const seenIds = new Set();
for (const image of images) {
  const where = image.file || image.path || JSON.stringify(image);

  // id must be a zero-padded 3-digit string.
  if (!/^\d{3}$/.test(image.id ?? '')) {
    fail(`id format: "${image.id}" is not a 3-digit id (${where})`);
    continue;
  }
  if (seenIds.has(image.id)) fail(`duplicate id: ${image.id} (${where})`);
  seenIds.add(image.id);

  // hex must be present and valid — the silent-null debt this script kills.
  if (!image.hex) {
    fail(`null hex: No.${image.id} ${where} did not join to a master-list color name`);
  } else if (!/^#[0-9A-F]{6}$/.test(image.hex)) {
    fail(`bad hex: No.${image.id} has "${image.hex}" (${where})`);
  }

  // cmyk must be present, integer 0-100, and consistent with the hex.
  if (image.hex && /^#[0-9A-F]{6}$/.test(image.hex)) {
    const expected = cmykFromHex(image.hex);
    const got = image.cmyk;
    if (!got || typeof got !== 'object') {
      fail(`missing cmyk: No.${image.id} ${where}`);
    } else if (got.c !== expected.c || got.m !== expected.m || got.y !== expected.y || got.k !== expected.k) {
      fail(`cmyk drift: No.${image.id} manifest=${JSON.stringify(got)} expected=${JSON.stringify(expected)}`);
    }
  }

  // filename must follow NNN-色名.ext and its number must equal the id.
  const m = (image.file || '').match(/^(\d{3})-(.+)\.[^.]+$/);
  if (!m) {
    fail(`filename: "${image.file}" must match NNN-色名.ext`);
  } else if (m[1] !== image.id) {
    fail(`filename/id drift: file "${image.file}" carries ${m[1]} but id is ${image.id}`);
  }

  // The color name must agree with the master-list entry at this position.
  const idx = Number(image.id) - 1;
  const entry = master[idx];
  if (entry) {
    const fileName = colorNameFromFile(image.file || '');
    if (entry.name !== fileName) {
      fail(`name drift: No.${image.id} file="${fileName}" but master-list[#${image.id}]="${entry.name}"`);
    }
    if (image.hex && entry.hex !== image.hex) {
      fail(`hex drift: No.${image.id} manifest=${image.hex} but master-list=${entry.hex}`);
    }
  }
}

// 3. Ids must be contiguous 001..N (no gaps — a gap silently renumbers SEO URLs).
for (let i = 1; i <= images.length; i += 1) {
  const id = String(i).padStart(3, '0');
  if (!seenIds.has(id)) fail(`missing id in sequence: expected ${id}`);
}

if (failures.length) {
  console.error('Manifest join verification FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Manifest join verified: ${images.length} colors, ids 001-${String(images.length).padStart(3, '0')} contiguous, every hex joined.`);
}
