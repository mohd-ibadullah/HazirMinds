/* ============================================================
   HAZIRMINDS — §8 SCRIPTED UI SELF-TEST
   Run after every wave:  node scripts/ui-selftest.mjs
   Evidence: /ui-evidence/<WAVE>/ (PNGs + selftest.json)
   10 checks per §8 — any failure fails the wave.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL || 'http://localhost:4173';
const EXE = process.env.CHROME_PATH || 'C:\\Users\\froms\\.cache\\puppeteer\\chrome\\win64-153.0.8010.36\\chrome-win64\\chrome.exe';
const WAVE = process.env.WAVE || 'wave-1';
const EVID = path.join(ROOT, 'ui-evidence', WAVE);
fs.mkdirSync(EVID, { recursive: true });

const AXE = fs.readFileSync(path.join(ROOT, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

/* routes discovered from the build itself */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const DIST = path.join(ROOT, 'dist');
const routes = walk(DIST).filter(f => f.endsWith('.html')).map(f => {
  const rel = path.relative(DIST, f).replace(/\\/g, '/');
  return rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
}).filter(r => !r.startsWith('/ai/'));

/* full §8 battery on these; lighter (200/console/overflow) on the rest */
const KEY = ['/', '/services', '/pricing', '/enterprise', '/chief-of-staff', '/masjids', '/compare', '/compare/smith-ai', '/compare/masjid-platforms', '/case-studies', '/404.html'];
const WIDTHS = [360, 768, 1024, 1440];

const results = [];
const record = (route, check, pass, detail) => {
  results.push({ route, check, pass: !!pass, detail: detail || '' });
  if (!pass) console.log(`  ✗ ${route} ${check}${detail ? ' → ' + detail : ''}`);
};

const pngVariance = (buf) => { // coarse "is this screenshot blank?" measure
  const uniq = new Set();
  for (let i = 0; i < buf.length; i += 97) uniq.add(buf[i]);
  return { bytes: buf.length, spread: uniq.size };
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EXE, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--hide-scrollbars']
});

const newPage = async (opts = {}) => {
  const p = await browser.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  p.on('pageerror', e => errs.push('PAGEERROR ' + String(e).slice(0, 200)));
  p.on('requestfailed', r => { if (!String(r.url()).includes('favicon')) errs.push('REQFAIL ' + r.url().slice(0, 120)); });
  if (opts.js === false) await p.setJavaScriptEnabled(false);
  // The host OS may have reduced-motion ON. Motion-mode checks must not inherit that,
  // so emulate explicitly: 'reduce' only when asked, otherwise force 'no-preference'.
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: opts.reduce ? 'reduce' : 'no-preference' }]).catch(() => { });
  if (opts.print) await p.emulateMediaType('print');
  await p.setViewport({ width: opts.width || 1440, height: opts.height || 900 });
  await p.evaluateOnNewDocument(() => {
    window.__cls = 0;
    try {
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) { }
  });
  return { p, errs };
};

/* ---------- 1+2. route 200, console clean, overflow at 4 widths ---------- */
console.log('\n[1/2] routes 200 · console clean · overflow @360/768/1024/1440');
for (const route of routes) {
  const { p, errs } = await newPage({ width: 1440 });
  let status = 0;
  try {
    const resp = await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 });
    status = resp ? resp.status() : 0;
    await sleep(500);
  } catch (e) { status = 0; }
  record(route, 'route 200', status === 200, 'status ' + status);
  record(route, 'console errors == 0', errs.length === 0, errs.slice(0, 2).join(' | '));
  const txt = await p.evaluate(() => document.body.innerText.trim().length).catch(() => 0);
  record(route, 'non-blank', txt > 300, 'chars ' + txt);
  for (const w of WIDTHS) {
    await p.setViewport({ width: w, height: 900 });
    await sleep(180);
    const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })).catch(() => ({ sw: 0, cw: 1 }));
    record(route, `no h-overflow @${w}`, o.sw <= o.cw, `sw ${o.sw} / cw ${o.cw}`);
  }
  await p.close();
}

/* ---------- 3+4. reveals resolved + motion alive + 5. screenshot + 10. CLS ---------- */
console.log('[3/4/5/10] reveals · motion alive · screenshot · CLS');
for (const route of KEY) {
  const { p, errs } = await newPage({ width: 1440, height: 900 });
  await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 });
  // step-scroll top → true bottom (re-measured each step: pins grow the document)
  let y = 0, guard = 0;
  while (guard++ < 300) {
    const max = await p.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight);
    if (y >= max) break;
    y = Math.min(y + 620, max);
    await p.evaluate(v => window.scrollTo(0, v), y);
    await sleep(90);
  }
  await sleep(1600);

  const hidden = await p.evaluate(() =>
    [...document.querySelectorAll('[data-reveal], [data-reveal="children"] > *')]
      .filter(e => { const cs = getComputedStyle(e); return parseFloat(cs.opacity) === 0 || (cs.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(cs.transform)); })
      .map(e => (e.className || e.tagName).toString().slice(0, 40)));
  record(route, 'all [data-reveal] visible (opacity 1, no transform)', hidden.length === 0, hidden.slice(0, 3).join(' , '));

  if (route === '/' || route === '/masjids') {
    const anims = await p.evaluate(() => document.getAnimations().length);
    record(route, 'motion alive (getAnimations > 0)', anims > 0, 'animations ' + anims);
  }

  const shot = await p.screenshot({ fullPage: true, encoding: 'binary' });
  const v = pngVariance(shot);
  const file = (route === '/' ? 'home' : route.replace(/[/]/g, '_').replace(/^_/, '')) + '.png';
  fs.writeFileSync(path.join(EVID, file), shot);
  record(route, 'full-page screenshot non-blank', v.bytes > 20000 && v.spread > 20, `${v.bytes}B spread ${v.spread}`);

  const cls = await p.evaluate(() => window.__cls || 0);
  record(route, 'CLS < 0.05', cls < 0.05, 'cls ' + cls.toFixed(4));
  record(route, 'console errors == 0 (key-route pass)', errs.length === 0, errs.slice(0, 2).join(' | '));
  await p.close();
}

/* ---------- 6. axe: 0 critical ---------- */
console.log('[6] axe-core scan (critical)');
for (const route of KEY) {
  const { p } = await newPage({ width: 1440, height: 900 });
  await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 });
  await p.addScriptTag({ content: AXE });
  const res = await p.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
  }).catch(e => [{ id: 'axe-error', impact: 'error', nodes: 1, msg: String(e).slice(0, 80) }]);
  const critical = res.filter(v => v.impact === 'critical');
  const serious = res.filter(v => v.impact === 'serious');
  record(route, 'axe: 0 critical violations', critical.length === 0, critical.map(v => `${v.id}(${v.nodes})`).join(', '));
  record(route, 'axe: 0 serious violations', serious.length === 0, serious.map(v => `${v.id}(${v.nodes})`).join(', '));
  if (res.length) console.log(`  · ${route} axe findings: ${res.map(v => v.id + ':' + v.impact).join(', ')}`);
  await p.close();
}

/* ---------- 7. reduced motion: visible, no animations ---------- */
console.log('[7] reduced-motion emulation');
for (const route of ['/', '/masjids', '/pricing']) {
  const { p } = await newPage({ width: 1440, height: 900, reduce: true });
  await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(900);
  const m = await p.evaluate(() => ({
    hidden: [...document.querySelectorAll('[data-reveal], [data-reveal="children"] > *')].filter(e => parseFloat(getComputedStyle(e).opacity) === 0).length,
    anims: document.getAnimations().length,
    cls: document.documentElement.className, motionReady: document.documentElement.classList.contains('motion-ready')
  }));
  record(route, 'reduced-motion: content visible', m.hidden === 0, 'hidden ' + m.hidden);
  record(route, 'reduced-motion: motion off', !m.motionReady, 'classes ' + m.cls);
  await p.close();
}

/* ---------- 8. print emulation ---------- */
console.log('[8] print emulation');
for (const route of ['/', '/masjids']) {
  const { p } = await newPage({ width: 1440, height: 900 });
  await p.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 });
  await p.emulateMediaType('print');
  await sleep(400);
  const hidden = await p.evaluate(() => [...document.querySelectorAll('[data-reveal], [data-reveal="children"] > *')].filter(e => parseFloat(getComputedStyle(e).opacity) === 0).length);
  record(route, 'print: all content visible', hidden === 0, 'hidden ' + hidden);
  await p.close();
}

/* ---------- 9. no-JS ---------- */
console.log('[9] no-JS fallback');
for (const route of ['/', '/masjids']) {
  const { p } = await newPage({ width: 1440, height: 900, js: false });
  await p.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(300);
  const m = await p.evaluate(() => ({
    hidden: [...document.querySelectorAll('[data-reveal], [data-reveal="children"] > *')].filter(e => parseFloat(getComputedStyle(e).opacity) === 0).length,
    txt: document.body.innerText.trim().length
  }));
  record(route, 'no-JS: content visible', m.hidden === 0 && m.txt > 300, `hidden ${m.hidden} chars ${m.txt}`);
  await p.close();
}

await browser.close();

/* ---------- summary ---------- */
const fails = results.filter(r => !r.pass);
const summary = {
  wave: WAVE, base: BASE, ranAt: new Date().toISOString(),
  routes: routes.length, checks: results.length, passed: results.length - fails.length, failed: fails.length,
  failures: fails
};
fs.writeFileSync(path.join(EVID, 'selftest.json'), JSON.stringify(summary, null, 2));
console.log('\n================ UI SELF-TEST (' + WAVE + ') ================');
console.log(`${summary.passed}/${summary.checks} checks pass · routes ${summary.routes} · evidence → ui-evidence/${WAVE}/`);
if (fails.length) {
  console.log('\nFAILURES:');
  fails.slice(0, 25).forEach(f => console.log(`  ✗ [${f.route}] ${f.check}${f.detail ? ' → ' + f.detail : ''}`));
  process.exit(1);
}
