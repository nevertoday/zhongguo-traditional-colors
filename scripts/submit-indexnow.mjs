/*
 * Pushes the sitemap's URLs to IndexNow (Bing / Yandex / Seznam), so changed or
 * new pages get discovered without waiting for an organic crawl. Run AFTER a
 * deploy: `npm run submit:indexnow`.
 *
 * The IndexNow key lives in a static <key>.txt at the site root (committed, so
 * GitHub Pages serves it for verification). This reads that key file, extracts
 * every <loc> from sitemap.xml, and POSTs the batch to api.indexnow.org.
 *
 * Network side effect — intentionally NOT part of prepare:release / CI.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'colors.xiaoxiaodong.ai';
const SITE = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function findKey() {
  const entries = await readdir(ROOT);
  const keyFile = entries.find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!keyFile) throw new Error('No IndexNow key file (<32-hex>.txt) found at repo root.');
  const key = (await readFile(path.join(ROOT, keyFile), 'utf8')).trim();
  if (key !== keyFile.replace(/\.txt$/, '')) {
    throw new Error(`IndexNow key file ${keyFile} must contain exactly its own key.`);
  }
  return { key, keyLocation: `${SITE}/${keyFile}` };
}

function urlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const { key, keyLocation } = await findKey();
  const sitemap = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const urlList = urlsFromSitemap(sitemap);
  if (!urlList.length) throw new Error('sitemap.xml had no <loc> URLs.');

  const body = { host: HOST, key, keyLocation, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  // IndexNow returns 200 (accepted) or 202 (accepted, pending). Anything else is a real error.
  console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
