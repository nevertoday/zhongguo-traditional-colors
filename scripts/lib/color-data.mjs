/*
 * Canonical helpers for the color data layer, shared by the manifest builder
 * (scripts/build-manifest.mjs) and its verifier (scripts/verify-manifest-join.mjs)
 * so the producer and the checker can never drift apart (same CMYK formula, same
 * master-list parser, same filename parser).
 */

// Parse the canonical 742-color master list. Color rows live inside a fenced
// ```text block as `色名 #HEX`; only lines INSIDE a fence are parsed, so prose
// or examples that happen to end in a #RRGGBB token can never become phantom
// entries.
export function loadMasterList(content) {
  const entries = [];
  let inFence = false;
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) continue;
    const match = line.match(/^(.+?)\s+(#[0-9A-Fa-f]{6})$/);
    if (match) entries.push({ name: match[1], hex: match[2].toUpperCase() });
  }
  return entries;
}

// Each image is named NNN-色名.ext. The NNN prefix is the color's STABLE id —
// never re-derive it from directory sort position, or inserting/removing a file
// would silently renumber every color after it (and every SEO URL keyed off id).
export function parseImageName(file) {
  const match = file.match(/^(\d{3})-(.+)\.[^.]+$/);
  return match ? { id: match[1], name: match[2] } : null;
}

// Naive RGB→CMYK (no ICC profile) — the formula the web UI shows, lifted into
// the data layer so every consumer reads one canonical value.
export function cmykFromHex(hex) {
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
