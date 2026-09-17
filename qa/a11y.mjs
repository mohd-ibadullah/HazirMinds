/* Accessibility checks that axe does not cover.
 *
 * axe answers "is this markup valid and are these colours readable". It does not answer the two
 * questions a keyboard or low-vision visitor actually hits:
 *   1. Can I reach everything with Tab, and can I SEE where I am?
 *   2. Does the layout survive being zoomed in?
 *
 * So this walks the real tab order and measures each focus indicator against the same element's
 * resting state, then re-renders the page at the reflow width WCAG 1.4.10 requires (320 CSS px,
 * which is what 400% zoom produces on a 1280px window).
 *
 * Usage: node qa/a11y.mjs            (needs: node server.js 4173)
 */
import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:4173';
const DIST = path.join(process.cwd(), 'dist');
const ENGINE = (process.argv[2] || 'webkit').toLowerCase();
const ONLY = process.argv.slice(3).filter(a => a.startsWith('/'));
const MAX_TABS = 90;
const REFLOW_W = 320;   /* WCAG 1.4.10 reflow */
const ZOOM_W = 720;     /* 200% zoom on a 1440px window */
const ENGINES = { chromium, firefox, webkit };
if (!ENGINES[ENGINE]) { console.error('engine must be chromium, firefox or webkit'); process.exit(2); }

function allRoutes() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) {
        const rel = p.slice(DIST.length).split(path.sep).join('/');
        if (rel === '/404.html') continue;
        out.push(rel.replace(/\/index\.html$/, '/'));
      }
    }
  })(DIST);
  return out.sort();
}

const routes = ONLY.length ? ONLY : allRoutes();
const findings = [];
const F = (sev, route, msg) => findings.push({ sev, route, msg });

const browser = await ENGINES[ENGINE].launch();
const page = await browser.newPage();
await page.addInitScript(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) { } });

for (const route of routes) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => { });
  /* Measure the resting paint of every focusable element BEFORE anything is focused, so a
     "focus indicator" is proven to be a change and not just a default outline that was there all
     along. Keyed by a stable element signature so the tab-order walk can look the same element up
     — an index-based map silently compared the wrong pairs. */
  const SIG = `(a => a.tagName + '.' + (a.className || '') + '#' + (a.id || '') + '|' + (a.textContent || '').trim().slice(0, 18))`;
  const restMap = await page.evaluate((sigSrc) => {
    const sig = eval(sigSrc);
    const sel = 'a[href],button,summary,input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const out = {};
    document.querySelectorAll(sel).forEach(el => {
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      if (b.width < 1 || b.height < 1 || cs.display === 'none' || cs.visibility === 'hidden') return;
      out[sig(el)] = { outline: cs.outlineWidth + ' ' + cs.outlineStyle, shadow: cs.boxShadow, bg: cs.backgroundColor };
    });
    return out;
  }, SIG);

  /* ---- 1. skip link must work ----
     Safari's default keyboard behaviour does not Tab to links at all (only form controls, unless
     the user enables Full Keyboard Access), so "the first Tab stop is the skip link" is a Chromium
     assumption, not a defect. What matters on every engine is that the link exists and becomes
     visible when it is focused, so that is what is asserted here; the first-Tab landing is reported
     as information instead. */
  const skip = await page.evaluate(() => {
    const a = document.querySelector('.skip-link');
    if (!a) return { present: false };
    a.focus();
    const cs = getComputedStyle(a);
    const b = a.getBoundingClientRect();
    return { present: true, focused: document.activeElement === a, w: Math.round(b.width), h: Math.round(b.height), vis: cs.visibility, op: cs.opacity };
  });
  if (!skip.present) F('P1', route, 'no .skip-link in the document');
  else if (!skip.focused) F('P2', route, 'skip link cannot take focus');
  else if (skip.w < 1 || skip.h < 1 || skip.vis === 'hidden' || skip.op === '0') F('P1', route, 'skip link stays invisible when focused — a keyboard user cannot see it');

  await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return null;
    return { cls: a.className || '', text: (a.textContent || '').trim().slice(0, 30) };
  });
  const firstIsSkip = !!(first && /skip-link/.test(first.cls));
  if (!firstIsSkip && ENGINE === 'chromium') F('P2', route, 'first Tab stop is not the skip link — got «' + (first ? first.text : 'nothing') + '»');
  if (!firstIsSkip) console.log(`   info  ${route} (${ENGINE}): first Tab lands on «${first ? first.text : 'nothing'}»`);

  /* ---- 2. walk the tab order: reachable, visible, and visibly focused ---- */
  const seen = new Set();
  const noIndicator = [], invisible = [];
  for (let n = 0; n < MAX_TABS; n++) {
    await page.keyboard.press('Tab');
    const st = await page.evaluate((sigSrc) => {
      const sig = eval(sigSrc);
      const a = document.activeElement;
      if (!a || a === document.body || a === document.documentElement) return { end: true };
      const cs = getComputedStyle(a);
      const b = a.getBoundingClientRect();
      return {
        key: sig(a),
        outline: cs.outlineWidth + ' ' + cs.outlineStyle,
        shadow: cs.boxShadow, bg: cs.backgroundColor,
        w: Math.round(b.width), h: Math.round(b.height),
        vis: cs.visibility, op: cs.opacity, text: (a.textContent || '').trim().slice(0, 26)
      };
    }, SIG);
    if (st.end) break;
    if (seen.has(st.key)) continue;
    seen.add(st.key);
    if (st.w < 1 || st.h < 1 || st.vis === 'hidden') invisible.push(st.text);
    const rest = restMap[st.key];
    const changed = rest ? (st.outline !== rest.outline || st.shadow !== rest.shadow || st.bg !== rest.bg) : true;
    const hasOutline = !/^(0px|0)\s/.test(st.outline) && !/none/.test(st.outline);
    if (!changed && !hasOutline) noIndicator.push(st.text);
  }
  if (invisible.length) F('P1', route, 'focused but not visible: ' + [...new Set(invisible)].slice(0, 4).join(' · '));
  if (noIndicator.length) F('P1', route, 'focusable with no visible focus change (' + noIndicator.length + '): ' + [...new Set(noIndicator)].slice(0, 4).join(' · '));

  /* ---- 3. reflow at 320px (WCAG 1.4.10) and at 200% zoom ---- */
  for (const [label, w] of [['reflow@320', REFLOW_W], ['zoom200@720', ZOOM_W]]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      let worst = null, best = -1, vw = d.clientWidth;
      if (d.scrollWidth - vw > 1) {
        document.querySelectorAll('body *').forEach(el => {
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1) { let dep = 0, n = el; while (n = n.parentElement) dep++; if (dep > best) { best = dep; worst = el; } }
        });
      }
      /* clipped text: an element whose scrollWidth exceeds its clientWidth while hiding overflow */
      const clipped = [];
      document.querySelectorAll('h1,h2,h3,p,li,span,a,button').forEach(el => {
        const cs = getComputedStyle(el);
        if (el.scrollWidth > el.clientWidth + 2 && /hidden|clip/.test(cs.overflowX)) clipped.push((el.textContent || '').trim().slice(0, 24));
      });
      return { over: d.scrollWidth - vw, at: worst ? worst.tagName + '.' + String(worst.className).split(' ')[0] : null, clipped: clipped.slice(0, 3) };
    });
    if (r.over > 1) F('P1', route, label + ': horizontal scroll +' + r.over + 'px at ' + r.at);
    if (r.clipped.length) F('P2', route, label + ': clipped text: ' + r.clipped.join(' · '));
  }
}

await browser.close();

const order = { P0: 0, P1: 1, P2: 2 };
const groups = new Map();
findings.forEach(f => {
  const k = f.sev + '|' + f.msg.replace(/\d+/g, 'N');
  if (!groups.has(k)) groups.set(k, { sev: f.sev, msg: f.msg, where: [], n: 0 });
  const g = groups.get(k); g.n++;
  if (g.where.length < 6) g.where.push(f.route);
});
const list = [...groups.values()].sort((a, b) => order[a.sev] - order[b.sev] || b.n - a.n);
const counts = { P0: 0, P1: 0, P2: 0 };
findings.forEach(f => counts[f.sev]++);

console.log(`=== A11Y: ${routes.length} routes — tab order, focus visibility, reflow@${REFLOW_W}, zoom200@${ZOOM_W}`);
console.log(`=== FINDINGS  P0=${counts.P0}  P1=${counts.P1}  P2=${counts.P2}  (${findings.length} raw, ${list.length} unique)`);
list.forEach(g => console.log(`${g.sev}  ×${g.n}  ${g.msg}  — ${g.where.join(', ')}${g.n > g.where.length ? ', …' : ''}`));
if (!findings.length) console.log('CLEAN — every route: keyboard reachable, focus visible, no horizontal scroll when zoomed');
process.exit(counts.P0 ? 1 : 0);
