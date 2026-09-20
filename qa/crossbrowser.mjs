/* Cross-browser sweep — the same checks as qa/e2e.js, run on an engine that is not Chromium.
 *
 * The Puppeteer harness only ever exercised Chrome, so "every route passes" was really
 * "every route passes in Blink". Safari is WebKit and Firefox is Gecko; both are used by real
 * visitors and both differ in ways that matter (grid/flex defaults, clamp support, :has(),
 * view-transition support, momentum-scroll behaviour).
 *
 * Usage:  node qa/crossbrowser.mjs firefox
 *         node qa/crossbrowser.mjs webkit
 *         node qa/crossbrowser.mjs webkit /pricing /services    (specific routes)
 *
 * Requires the local server: node server.js 4173
 */
import { firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';

const ENGINE = (process.argv[2] || 'webkit').toLowerCase();
const ONLY = process.argv.slice(3);
const BASE = 'http://localhost:4173';
const DIST = path.join(process.cwd(), 'dist');
const WIDTHS = [{ n: '1440', w: 1440, h: 900 }, { n: '768', w: 768, h: 1024 }, { n: '390', w: 390, h: 844 }];

function allRoutes() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) {
        const rel = p.slice(DIST.length).split(path.sep).join('/');
        if (rel === '/404.html') { out.push('/404.html'); continue; }
        out.push(rel.replace(/\/index\.html$/, '/'));
      }
    }
  })(DIST);
  return out.sort();
}

const launch = { firefox, webkit }[ENGINE];
if (!launch) { console.error('engine must be firefox or webkit'); process.exit(2); }

const routes = ONLY.length ? ONLY : allRoutes();
const findings = [];
const F = (sev, route, w, msg) => findings.push({ sev, route, w, msg });

const browser = await launch.launch();
const page = await browser.newPage();
let errs = [];
page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 150)); });
page.on('pageerror', e => errs.push('PAGEERROR: ' + String(e.message).slice(0, 150)));
page.on('requestfailed', r => {
  const t = (r.failure() && r.failure().errorText) || '';
  /* Every engine reports a cancelled request in its own dialect, and every one of them is the
     same harness artifact: the sweep resizes the viewport between route passes, which cancels an
     in-flight srcset candidate. The image resolves 200 on the next pass — /chief-of-staff's
     cos-desk-1200.webp was reported against a later route purely because /chief-of-staff precedes it
     in route order. Chromium says net::ERR_ABORTED, Firefox NS_BINDING_ABORTED, WebKit
     "Load request cancelled". None is a failure. */
  if (/ERR_ABORTED|NS_BINDING_ABORTED|Load request cancelled|request cancelled/i.test(t)) return;
  errs.push('REQFAIL[' + t + ']: ' + r.url().slice(0, 110));
});
await page.addInitScript(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) { } });

/* Engine capability probe — recorded once, so a finding can be read in context. */
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
const caps = await page.evaluate(() => {
  /* Probe the at-rule itself, not a lookalike. An earlier version fell back to
     CSS.supports('contain','paint') and therefore reported "view transitions: yes" on Firefox,
     which does not support cross-document transitions at all — a capability claim I would then
     have published as a fact. Inject the rule and see whether the engine keeps it. */
  let viewTransition = false;
  try {
    const s = document.createElement('style');
    s.textContent = '@view-transition{navigation:auto}';
    document.head.appendChild(s);
    for (const sheet of Array.from(document.styleSheets)) {
      let rules; try { rules = Array.from(sheet.cssRules); } catch (e) { continue; }
      if (rules.some(r => r.constructor.name === 'CSSViewTransitionRule')) viewTransition = true;
    }
    s.remove();
  } catch (e) { }
  return {
    viewTransition,
    hasHas: CSS.supports('selector(:has(*))'),
    clamp: CSS.supports('width', 'clamp(1px,2vw,3px)'),
    dvh: CSS.supports('height', '100dvh'),
    backdropFilter: CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'),
    aspectRatio: CSS.supports('aspect-ratio', '1/1'),
    gapFlex: CSS.supports('gap', '1px'),
    subgrid: CSS.supports('grid-template-columns', 'subgrid')
  };
});

for (const route of routes) {
  const is404 = route === '/404.html';
  for (const vp of WIDTHS) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    errs = [];
    let status = 0;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = resp ? resp.status() : 0;
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => { });
    } catch (e) { F('P0', route, vp.n, 'NAV FAIL: ' + String(e.message).slice(0, 90)); continue; }
    if (status >= 400 && !is404) F('P0', route, vp.n, 'HTTP ' + status);

    [...new Set(errs)].filter(e => !/favicon/.test(e)).forEach(e => F('P0', route, vp.n, e));

    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal],[data-reveal]>*').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(350);

    const r = await page.evaluate(() => {
      const d = document.documentElement, vw = d.clientWidth;
      const o = { overflow: d.scrollWidth - vw, at: null, smallTap: [], brokenImg: [], noAlt: [], noDim: [], dupId: [], h1: document.querySelectorAll('h1').length, main: !!document.querySelector('main'), skip: !!document.querySelector('.skip-link') };
      if (o.overflow > 1) {
        let worst = null, best = -1;
        document.querySelectorAll('body *').forEach(el => {
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1) { let dep = 0, n = el; while (n = n.parentElement) dep++; if (dep > best) { best = dep; worst = el; } }
        });
        o.at = worst ? worst.tagName + '.' + String(worst.className).split(' ')[0] + ' «' + (worst.textContent || '').trim().slice(0, 42) + '»' : '?';
      }
      document.querySelectorAll('a,button,summary').forEach(el => {
        const b = el.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) return;
        if (getComputedStyle(el).display === 'none') return;
        if (b.height < 24 || b.width < 24) o.smallTap.push(Math.round(b.width) + 'x' + Math.round(b.height) + ' «' + (el.textContent || '').trim().slice(0, 22) + '»');
      });
      document.querySelectorAll('img').forEach(im => {
        if (!im.hasAttribute('alt')) o.noAlt.push(im.getAttribute('src'));
        if (!im.getAttribute('width') || !im.getAttribute('height')) o.noDim.push(im.getAttribute('src'));
        if (im.complete && im.naturalWidth === 0) o.brokenImg.push(im.getAttribute('src'));
      });
      const ids = {};
      document.querySelectorAll('[id]').forEach(el => { ids[el.id] = (ids[el.id] || 0) + 1; });
      Object.keys(ids).forEach(k => { if (ids[k] > 1) o.dupId.push(k + '×' + ids[k]); });
      return o;
    });

    if (r.overflow > 1) F('P0', route, vp.n, 'H-OVERFLOW +' + r.overflow + 'px at ' + r.at);
    if (r.brokenImg.length) F('P0', route, vp.n, 'BROKEN IMG: ' + r.brokenImg.join(', ').slice(0, 120));
    if (r.h1 !== 1) F('P1', route, vp.n, 'h1 count=' + r.h1);
    if (!r.main) F('P1', route, vp.n, 'no <main> landmark');
    if (!r.skip) F('P2', route, vp.n, 'no skip-link');
    r.dupId.forEach(x => F('P1', route, vp.n, 'duplicate id ' + x));
    r.noAlt.forEach(x => F('P1', route, vp.n, 'img missing alt: ' + x));
    r.noDim.forEach(x => F('P1', route, vp.n, 'img missing width/height: ' + x));
    if (vp.w <= 768) r.smallTap.forEach(x => F('P2', route, vp.n, 'tap target ' + x));
  }
}

await browser.close();

const order = { P0: 0, P1: 1, P2: 2 };
const groups = new Map();
findings.forEach(f => {
  const k = f.sev + '|' + f.msg.replace(/\d+x\d+/g, 'WxH');
  if (!groups.has(k)) groups.set(k, { sev: f.sev, msg: f.msg, where: [], n: 0 });
  const g = groups.get(k); g.n++;
  const w = `${f.route}@${f.w}`;
  if (g.where.length < 6) g.where.push(w);
});
const list = [...groups.values()].sort((a, b) => order[a.sev] - order[b.sev] || b.n - a.n);
const counts = { P0: 0, P1: 0, P2: 0 };
findings.forEach(f => counts[f.sev]++);

console.log(`=== ${ENGINE.toUpperCase()}: ${routes.length} routes x ${WIDTHS.length} widths = ${routes.length * WIDTHS.length} loads`);
console.log('=== capabilities: ' + Object.entries(caps).map(([k, v]) => k + '=' + (v ? 'y' : 'n')).join('  '));
console.log(`=== FINDINGS  P0=${counts.P0}  P1=${counts.P1}  P2=${counts.P2}  (${findings.length} raw, ${list.length} unique)`);
list.forEach(g => console.log(`${g.sev}  ×${g.n}  ${g.msg}  — ${g.where.join(', ')}${g.n > g.where.length ? ', …' : ''}`));
if (!findings.length) console.log('CLEAN — every route, every width, all checks passed');
process.exit(counts.P0 ? 1 : 0);
