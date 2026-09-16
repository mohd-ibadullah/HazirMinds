// HazirMinds — end-to-end UI/UX audit across every route.
// Usage: node server.js 4173 & node qa/e2e.js [routeA routeB ...]
// Checks per route x width: status, console/page errors, failed requests, horizontal
// overflow, stuck-invisible reveals, tiny fonts, small tap targets, img alt/dims,
// unlabeled inputs, duplicate ids, heading order, landmarks, internal links, JSON-LD.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const BASE = 'http://localhost:4173';
const DIST = path.join(__dirname, '..', 'dist');
const WIDTHS = [{ n: '1440', w: 1440, h: 900 }, { n: '768', w: 768, h: 1024 }, { n: '390', w: 390, h: 844 }];

function allRoutes() {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) {
        const rel = p.slice(DIST.length).replace(/\\/g, '/');
        if (rel === '/404.html') { out.push('/404.html'); continue; }
        out.push(rel.replace(/\/index\.html$/, '/'));
      }
    }
  })(DIST);
  return out.sort();
}

(async () => {
  const routes = process.argv.slice(2).length ? process.argv.slice(2) : allRoutes();
  const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  let errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 150)); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message.slice(0, 150)));
  /* net::ERR_ABORTED means the browser cancelled a request — it happens when the harness
     resizes the viewport between route passes while a srcset candidate is still in flight.
     The image itself resolves 200 on the next pass, so counting aborts as failures produced
     two permanent P0s on /masjids that were never real. Only genuine network errors count. */
  page.on('requestfailed', r => {
    const err = (r.failure() && r.failure().errorText) || '';
    if (err === 'net::ERR_ABORTED') return;
    errs.push('REQFAIL[' + err + ']: ' + r.url().slice(0, 110));
  });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); localStorage.setItem('hazirminds_motion', 'on'); } catch (e) {} });

  const findings = [];
  const F = (sev, route, w, msg) => findings.push({ sev, route, w, msg });
  const internal = new Set();

  for (const route of routes) {
    const is404 = route === '/404.html';
    for (const vp of WIDTHS) {
      await page.setViewport({ width: vp.w, height: vp.h });
      errs = [];
      let status = 0;
      try {
        const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 });
        status = resp ? resp.status() : 0;
        try { await page.waitForNetworkIdle({ idleTime: 600, timeout: 6000 }); } catch (e) {}
      } catch (e) { F('P0', route, vp.n, 'NAV FAIL: ' + e.message.slice(0, 90)); continue; }
      if (status >= 400 && !is404) F('P0', route, vp.n, 'HTTP ' + status);
      // direct /404.html request is served as a normal document by a static host
      if (is404 && status === 200) { /* expected: requesting the file directly */ }
      else if (is404 && status !== 404) F('P1', route, vp.n, 'expected 404, got ' + status);

      const real = [...new Set(errs)].filter(e => !/favicon/.test(e) && !(is404 && /404/.test(e)));
      real.forEach(e => F('P0', route, vp.n, e));

      // reveal everything, scroll through
      await page.evaluate(async () => {
        document.querySelectorAll('[data-reveal],[data-reveal]>*').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
        window.scrollTo(0, 0);
      });
      await new Promise(r => setTimeout(r, 350));

      const r = await page.evaluate(() => {
        const d = document.documentElement;
        const vw = d.clientWidth;
        const o = { overflow: d.scrollWidth - vw, overflowAt: null, smallTap: [], imgNoAlt: [], imgNoDim: [], noLabel: [], dupId: [], tall: null, main: !!document.querySelector('main'), h1: document.querySelectorAll('h1').length, skip: !!document.querySelector('.skip-link'), emptySec: 0, linkSet: [] };
        if (o.overflow > 1) {
          let worst = null, best = -1;
          document.querySelectorAll('body *').forEach(el => { const b = el.getBoundingClientRect(); if (b.right > vw + 1) { let dep = 0, n = el; while (n = n.parentElement) dep++; if (dep > best) { best = dep; worst = el; } } });
          o.overflowAt = worst ? worst.tagName + '.' + String(worst.className).split(' ')[0] + ' «' + (worst.textContent || '').trim().slice(0, 42) + '»' : '?';
        }
        // tap targets (touch-sensitive: only measure at narrow widths)
        document.querySelectorAll('a,button,summary,input[type=checkbox],input[type=radio]').forEach(el => {
          const b = el.getBoundingClientRect();
          if (b.width < 1 || b.height < 1) return;
          if (getComputedStyle(el).display === 'none') return;
          if (b.height < 24 || b.width < 24) o.smallTap.push(Math.round(b.width) + 'x' + Math.round(b.height) + ' «' + (el.textContent || '').trim().slice(0, 22) + '»');
        });
        document.querySelectorAll('img').forEach(im => {
          if (!im.hasAttribute('alt')) o.imgNoAlt.push(im.getAttribute('src'));
          if (!im.getAttribute('width') || !im.getAttribute('height')) o.imgNoDim.push(im.getAttribute('src'));
        });
        document.querySelectorAll('input,select,textarea').forEach(el => {
          if (el.type === 'hidden') return;
          const id = el.id || '';
          if (!((id && document.querySelector('label[for="' + id + '"]')) || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.closest('label'))) o.noLabel.push(el.tagName + '#' + id);
        });
        const ids = {};
        document.querySelectorAll('[id]').forEach(el => { ids[el.id] = (ids[el.id] || 0) + 1; });
        Object.keys(ids).forEach(k => { if (ids[k] > 1) o.dupId.push(k + '×' + ids[k]); });
        document.querySelectorAll('section').forEach(s => { const b = s.getBoundingClientRect(); if (b.height > 60 && (s.textContent || '').trim().length < 25 && !s.querySelector('img,svg,canvas,form')) o.emptySec++; });
        // SVG labels must fit inside the shape they sit on (hub rect vs its two captions).
        // Compare a label only with the rect it actually sits on — a rect whose x-range
        // contains the label's centre — otherwise every satellite is compared to every other.
        o.svgOverflow = [];
        document.querySelectorAll('svg').forEach(svg => {
          const rects = [...svg.querySelectorAll('rect')];
          svg.querySelectorAll('text').forEach(t => {
            const tb = t.getBBox();
            const cx = tb.x + tb.width / 2;
            for (const sh of rects) {
              const sb = sh.getBBox();
              if (cx < sb.x || cx > sb.x + sb.width) continue;            // label is not on this box
              if (!(tb.y < sb.y + sb.height && tb.y + tb.height > sb.y)) continue;  // no vertical overlap
              const ol = +(sb.x - tb.x).toFixed(1), or_ = +((tb.x + tb.width) - (sb.x + sb.width)).toFixed(1);
              if (ol > 0.5 || or_ > 0.5) o.svgOverflow.push(`«${(t.textContent || '').trim().slice(0, 26)}» w=${tb.width.toFixed(0)} vs box ${sb.width.toFixed(0)} (L${ol} R${or_})`);
            }
          });
        });
        document.querySelectorAll('a[href^="/"]').forEach(a => o.linkSet.push(a.getAttribute('href')));
        return o;
      });

      if (r.overflow > 1) F('P0', route, vp.n, 'H-OVERFLOW +' + r.overflow + 'px at ' + r.overflowAt);
      if (r.h1 !== 1) F('P1', route, vp.n, 'h1 count=' + r.h1);
      if (!r.main) F('P1', route, vp.n, 'no <main> landmark');
      if (!r.skip) F('P2', route, vp.n, 'no skip-link');
      if (r.emptySec) F('P2', route, vp.n, r.emptySec + ' empty section(s)');
      r.dupId.forEach(x => F('P1', route, vp.n, 'duplicate id ' + x));
      r.imgNoAlt.forEach(x => F('P1', route, vp.n, 'img missing alt: ' + x));
      r.imgNoDim.forEach(x => F('P1', route, vp.n, 'img missing width/height: ' + x));
      r.noLabel.forEach(x => F('P1', route, vp.n, 'input without label: ' + x));
      if (vp.w <= 768) r.smallTap.forEach(x => F('P2', route, vp.n, 'tap target ' + x));
      r.svgOverflow.forEach(x => F('P1', route, vp.n, 'SVG label overflows its shape: ' + x));
      r.linkSet.forEach(h => internal.add(h));
    }
  }

  // internal link integrity (once, from the union of all hrefs)
  const exists = h => {
    const clean = h.split('#')[0].split('?')[0];
    if (!clean || clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
    const p = clean.replace(/^\//, '').replace(/\/$/, '');
    return fs.existsSync(path.join(DIST, p, 'index.html')) || fs.existsSync(path.join(DIST, p)) || fs.existsSync(path.join(DIST, p + '.html'));
  };
  [...internal].forEach(h => { if (!exists(h)) F('P0', '(site)', '-', 'dead internal link → ' + h); });

  await browser.close();

  // report — collapse identical messages into one line with a count
  const order = { P0: 0, P1: 1, P2: 2 };
  const groups = new Map();
  findings.forEach(f => {
    const k = f.sev + '|' + f.msg.replace(/\d+x\d+/g, 'WxH');
    if (!groups.has(k)) groups.set(k, { sev: f.sev, msg: f.msg, where: [], n: 0 });
    const g = groups.get(k);
    g.n++;
    const w = `${f.route}@${f.w}`;
    if (g.where.length < 6) g.where.push(w);
  });
  const list = [...groups.values()].sort((a, b) => order[a.sev] - order[b.sev] || b.n - a.n);
  const counts = { P0: 0, P1: 0, P2: 0 };
  findings.forEach(f => counts[f.sev]++);
  console.log(`=== E2E: ${routes.length} routes x ${WIDTHS.length} widths = ${routes.length * WIDTHS.length} page loads`);
  console.log(`=== FINDINGS  P0=${counts.P0}  P1=${counts.P1}  P2=${counts.P2}  (${findings.length} raw, ${list.length} unique)`);
  list.forEach(g => console.log(`${g.sev}  ×${g.n}  ${g.msg}  — ${g.where.join(', ')}${g.n > g.where.length ? ', …' : ''}`));
  if (!findings.length) console.log('CLEAN — every route, every width, all checks passed');
  process.exit(counts.P0 ? 1 : 0);
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(2); });
