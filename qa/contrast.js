// HazirMinds — contrast + visibility audit (WCAG 2.2 AA), alpha-correct.
// Usage: node server.js 4173 & node qa/contrast.js [path ...]
const puppeteer = require('puppeteer-core');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const BASE = 'http://localhost:4173';
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];

/* --- color maths (alpha-correct) --- */
const parse = c => {
  if (!c) return null;
  const m = String(c).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
};
const over = (fg, bg) => { // composite fg (may be translucent) onto bg (opaque)
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
};
const lum = c => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

(async () => {
  const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); localStorage.setItem('hazirminds_motion', 'on'); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 900 });

  let fails = 0, thin = 0;
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 });
    try { await page.waitForNetworkIdle({ idleTime: 700, timeout: 7000 }); } catch (e) {}
    // reveal everything so hidden sections can be measured
    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal],[data-reveal]>*').forEach(e => { e.style.opacity = '1'; e.style.transform = 'none'; });
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 400));

    // collect every visible text node's computed fg + effective opaque bg
    const items = await page.evaluate(() => {
      const pageBg = getComputedStyle(document.body).backgroundColor;
      const opaqueBg = el => {
        // walk up compositing translucent layers onto the page background.
        // gradients are transparent to backgroundColor — take their first colour stop.
        const layers = [];
        let n = el;
        while (n && n !== document.documentElement) {
          const cs = getComputedStyle(n);
          const c = cs.backgroundColor;
          if (c && !/rgba?\(0, 0, 0, 0\)/.test(c) && c !== 'transparent') layers.push(c);
          else if (cs.backgroundImage && cs.backgroundImage !== 'none') {
            const m = cs.backgroundImage.match(/rgba?\([^)]+\)/);
            if (m && !/rgba?\(0, 0, 0, 0\)/.test(m[0])) layers.push(m[0]);
          }
          n = n.parentElement;
        }
        const bgc = getComputedStyle(document.body).backgroundColor;
        if (bgc && !/rgba?\(0, 0, 0, 0\)/.test(bgc)) layers.push(bgc);
        return { layers, pageBg };
      };
      const out = [];
      document.querySelectorAll('p,li,span,a,td,th,b,h1,h2,h3,h4,h5,code,button,label,summary,figcaption,blockquote,em,strong,small,time,text').forEach(el => {
        const txt = (el.textContent || '').trim();
        if (!txt || el.children.length > 0) return;      // leaf text only — avoids double counting parents
        const isSvgText = el.tagName.toLowerCase() === 'text';
        if (isSvgText && el.querySelector('*')) return;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width < 2 || r.height < 2 || cs.display === 'none' || cs.visibility === 'hidden') return;
        if (parseFloat(cs.opacity) < 0.9) return;         // handled by the visibility pass
        // SVG text: fill is the paint, and it can sit on a shape (rect) siblings above
        let fg = cs.color, sel = el.tagName + (el.className ? '.' + String(el.className).split(' ').slice(0, 2).join('.') : '');
        if (isSvgText) {
          const f = cs.fill;
          if (f && !/^rgba?\(0, 0, 0, 0\)$/.test(f) && f !== 'none') fg = f;
          const owner = el.ownerSVGElement;
          // an SVG label sits on whichever sibling <rect> contains it (dark hub or white node)
          // — measure against that shape's fill, not the panel behind it.
          const shapes = owner ? owner.querySelectorAll('rect') : [];
          for (const sh of shapes) {
            const sb = sh.getBoundingClientRect();
            if (r.left >= sb.left - 6 && r.right <= sb.right + 6 && r.top >= sb.top - 6 && r.bottom <= sb.bottom + 6) {
              const shFill = getComputedStyle(sh).fill;
              return out.push({ fg, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight, 10) || 400, sel: sel + '(svg on rect)', t: txt.slice(0, 34), layers: [shFill], pageBg: 'rgba(0, 0, 0, 0)' });
            }
          }
          sel += '(svg)';
        }
        out.push({
          fg, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight, 10) || 400, sel, t: txt.slice(0, 34), ...opaqueBg(el)
        });
      });
      return out;
    });

    const seen = new Set(); const rows = [];
    for (const it of items) {
      const fg = parse(it.fg); if (!fg) continue;
      let bg = parse(it.pageBg) || { r: 255, g: 255, b: 255, a: 1 };
      for (let i = it.layers.length - 1; i >= 0; i--) { const L = parse(it.layers[i]); if (L) bg = over(L, bg); }
      const effFg = over(fg, bg);
      const rt = ratio(effFg, bg);
      const large = it.fs >= 24 || (it.fs >= 18.66 && it.fw >= 700);
      const need = large ? 3 : 4.5;
      const key = it.sel + it.fg + it.fs;
      if (seen.has(key)) continue; seen.add(key);
      rows.push({ rt, need, it });
    }
    rows.sort((a, b) => a.rt - b.rt);
    const pageFails = rows.filter(r => r.rt < r.need);
    const pageThin = rows.filter(r => r.rt >= r.need && r.rt < r.need + 0.5);
    fails += pageFails.length; thin += pageThin.length;
    console.log(`--- ${route}  lowest=${rows[0] ? rows[0].rt.toFixed(2) : 'n/a'}  FAIL=${pageFails.length}  thin=${pageThin.length}`);
    pageFails.forEach(r => console.log(`   FAIL ${r.rt.toFixed(2)} need ${r.need}  ${r.it.sel} ${r.it.fs}px w${r.it.fw} ${r.it.fg} «${r.it.t}»`));
    if (rows.length && !pageFails.length) console.log(`   lowest passing: ${rows[0].rt.toFixed(2)} ${rows[0].it.sel} ${rows[0].it.fs}px «${rows[0].it.t}»`);
  }
  await browser.close();
  console.log(`\nTOTAL contrast FAIL=${fails} thin=${thin}`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(2); });
