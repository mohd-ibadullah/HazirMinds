// Home-page UI/UX audit — resting, hover, focus and open states.
// node server.js 4173 & node qa/home-audit.js
const puppeteer = require('puppeteer-core');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const URL = 'http://localhost:4173/';

const parse = c => { const m = String(c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const findings = [];
const F = (sev, what, detail) => findings.push({ sev, what, detail });

(async () => {
  const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 140)); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message.slice(0, 140)));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); localStorage.setItem('hazirminds_motion', 'on'); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
  try { await page.waitForNetworkIdle({ idleTime: 700, timeout: 8000 }); } catch (e) {}
  await page.evaluate(async () => { document.querySelectorAll('[data-reveal],[data-reveal]>*').forEach(e => { e.style.opacity = '1'; e.style.transform = 'none'; }); const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } window.scrollTo(0, 0); });
  await new Promise(r => setTimeout(r, 500));

  /* ---------- 1. SECTION RHYTHM + SPACING ---------- */
  const rhythm = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('main > section')];
    return secs.map((s, i) => {
      const cs = getComputedStyle(s), r = s.getBoundingClientRect();
      return { i, cls: String(s.className).replace(/\s+/g, '.').slice(0, 44), bg: cs.backgroundColor, pt: cs.paddingTop, pb: cs.paddingBottom, h: Math.round(r.height), id: s.id || '' };
    });
  });
  console.log('--- SECTION RHYTHM (' + rhythm.length + ' sections)');
  rhythm.forEach(s => console.log(`  ${s.i} ${s.id || '-'} ${s.cls} bg=${s.bg} pad=${s.pt}/${s.pb} h=${s.h}`));
  // alternating band check: two adjacent sections with identical opaque bg = no visual break
  for (let i = 1; i < rhythm.length; i++) {
    const a = parse(rhythm[i - 1].bg), b = parse(rhythm[i].bg);
    if (a && b && a.a > 0.9 && b.a > 0.9 && a.r === b.r && a.g === b.g && a.b === b.b) {
      F('P2', 'adjacent sections share the same background', `#${i - 1} ${rhythm[i - 1].cls} and #${i} ${rhythm[i].cls} both ${rhythm[i].bg}`);
    }
  }

  /* ---------- 2. GRID / CARD RAGGEDNESS (unequal heights in one row) ---------- */
  const ragged = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.grid-2,.grid-3,.grid-4,.invariant-grid,.split-grid,.trust-row,.price-strip').forEach(g => {
      const kids = [...g.children].filter(k => k.getBoundingClientRect().height > 20);
      if (kids.length < 2) return;
      const hs = kids.map(k => Math.round(k.getBoundingClientRect().height));
      const min = Math.min(...hs), max = Math.max(...hs);
      if (max - min > 4) out.push({ cls: String(g.className).slice(0, 40), heights: hs, delta: max - min });
    });
    return out;
  });
  ragged.forEach(r => F('P2', 'cards in a row have unequal heights', `${r.cls} heights=[${r.heights}] Δ${r.delta}px`));

  /* ---------- 3. HOVER STATE: real mouse hover, does the element visibly respond? ---------- */
  const HOVER_SEL = ['.btn--primary', '.btn--ghost', '.btn--brass', '.link-arrow', '.faq-q', '.trade-chip',
    '.mega a', '.nav-link', '.footer ul a', '.crumbs a', '.to-top', '.asst-btn',
    '.pricing-card', '.price-card', '.card', '.pill', '.svc-rail a', '.socials a', '.door'];
  const PROBE = ['backgroundColor', 'color', 'borderTopColor', 'borderBottomColor', 'boxShadow', 'transform', 'opacity', 'outlineColor', 'textDecorationLine'];
  const noHover = [];
  for (const sel of HOVER_SEL) {
    // scrollIntoView is animated by Lenis — coordinates measured before it settles are
    // stale, and `:hover` then misses entirely (that produced a page of false "no hover").
    const found = await page.evaluate(async s => {
      const els = [...document.querySelectorAll(s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 24 && r.height > 14 && getComputedStyle(e).display !== 'none'; });
      if (!els.length) return null;
      els[0].scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise(r => setTimeout(r, 700));
      const el = document.querySelector(s);
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight || r.width < 24) return { skip: true, text: (el.textContent || '').trim().slice(0, 20) };
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), text: (el.textContent || '').trim().slice(0, 24) };
    }, sel);
    if (!found) continue;
    if (found.skip) { noHover.push(`${sel} SKIPPED-OFFSCREEN «${found.text}»`); continue; }
    await page.mouse.move(4, 500);
    await new Promise(r => setTimeout(r, 160));
    const rest = await page.evaluate((s, props) => { const cs = getComputedStyle(document.querySelector(s)); return props.map(p => cs[p]).join('|'); }, sel, PROBE);
    await page.mouse.move(found.x, found.y);
    await new Promise(r => setTimeout(r, 380));
    const hov = await page.evaluate((s, props) => { const cs = getComputedStyle(document.querySelector(s)); return props.map(p => cs[p]).join('|'); }, sel, PROBE);
    const isHover = await page.evaluate(s => document.querySelector(s).matches(':hover'), sel);
    // only report when the cursor actually landed on it — otherwise the probe is lying
    if (isHover && rest === hov) noHover.push(`${sel} «${found.text}»`);
    if (!isHover) noHover.push(`${sel} NOT-REACHED-BY-CURSOR «${found.text}»`);
  }
  await page.mouse.move(5, 400);
  console.log('--- HOVER STATE RESPONSE');
  const realNoHover = noHover.filter(x => !/NOT-REACHED-BY-CURSOR|SKIPPED-OFFSCREEN/.test(x));
  noHover.filter(x => /NOT-REACHED|SKIPPED/.test(x)).forEach(x => console.log('  (not reachable in resting state: ' + x + ')'));
  if (realNoHover.length) { realNoHover.forEach(x => { console.log('  NO HOVER: ' + x); F('P2', 'interactive element has no hover feedback', x); }); }
  else console.log('  every reachable control responds to hover');
  // the mega links only exist while their nav item is open — drive it the way a user does
  // with Puppeteer's own hover (raw mouse.move missed: the sticky nav sits at y≈84, and
  // coordinates read from a stale rect landed outside the trigger).
  const hasMega = await page.evaluate(() => !!document.querySelector('.nav-item .mega'));
  if (hasMega) {
    // Mouse physics in this harness is unreliable (Lenis + sticky nav), so test the two
    // halves deterministically: the JS open path via a dispatched mouseenter, and the
    // CSS hover rule via CDP forcePseudoState — no pointer travel involved.
    const jsOpen = await page.evaluate(async () => {
      document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('open'));
      const it = document.querySelector('.nav-item');
      const btn = it.querySelector('.nav-link');
      it.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
      await new Promise(r => setTimeout(r, 300));
      const m = it.querySelector('.mega');
      return { open: it.classList.contains('open'), vis: getComputedStyle(m).visibility, op: getComputedStyle(m).opacity, aria: btn.getAttribute('aria-expanded') };
    });
    console.log(`  mega JS-open: open=${jsOpen.open} vis=${jsOpen.vis} opacity=${jsOpen.op} aria=${jsOpen.aria}`);

    await page.evaluate(() => { const it = document.querySelector('.nav-item'); it.classList.add('open'); });
    const cdp = await page.createCDPSession();
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.nav-item .mega a' });
    const restStyle = await page.evaluate(() => { const a = document.querySelector('.nav-item .mega a'); const cs = getComputedStyle(a); return { bg: cs.backgroundColor, pad: cs.paddingLeft, border: cs.borderTopColor }; });
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] });
    await new Promise(r => setTimeout(r, 250));
    const hovStyle = await page.evaluate(() => { const a = document.querySelector('.nav-item .mega a'); const cs = getComputedStyle(a); return { bg: cs.backgroundColor, pad: cs.paddingLeft, border: cs.borderTopColor, title: getComputedStyle(a.querySelector('b')).color }; });
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    console.log(`  mega CSS-hover: rest bg=${restStyle.bg} → hover bg=${hovStyle.bg} border=${hovStyle.border} padL=${hovStyle.pad} title=${hovStyle.title}`);

    if (!jsOpen.open) F('P1', 'mega menu does not open on mouseenter', 'nav trigger');
    else if (jsOpen.aria !== 'true') F('P2', 'mega trigger aria-expanded not set on open', String(jsOpen.aria));
    if (restStyle.bg === hovStyle.bg && restStyle.border === hovStyle.border) F('P2', 'mega link hover produces no visual change', 'mega link');
    if (parseFloat(hovStyle.pad) < 12) F('P2', 'mega link hover padding is too tight', hovStyle.pad);
    await page.evaluate(() => document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('open')));
  }
  const hoverContrast = [];
  for (const h of ['.mega a', '.btn--primary', '.btn--ghost', '.faq-q', '.trade-chip', '.pill--dark']) {
    const box = await page.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, h);
    if (!box) continue;
    await page.mouse.move(box.x, box.y);
    await new Promise(r => setTimeout(r, 250));
    const m = await page.evaluate(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const eff = node => { const layers = []; let n = node; while (n && n !== document.documentElement) { const cs = getComputedStyle(n); const c = cs.backgroundColor; if (c && !/rgba?\(0, 0, 0, 0\)/.test(c)) layers.push(c); else if (cs.backgroundImage && cs.backgroundImage !== 'none') { const mm = cs.backgroundImage.match(/rgba?\([^)]+\)/); if (mm && !/rgba?\(0, 0, 0, 0\)/.test(mm[0])) layers.push(mm[0]); } n = n.parentElement; } const b = getComputedStyle(document.body).backgroundColor; if (b && !/rgba?\(0, 0, 0, 0\)/.test(b)) layers.push(b); return layers; };
      const leaf = el.matches('a,button') && el.querySelector('b,span') ? el.querySelector('b,span') : el;
      return { fg: getComputedStyle(leaf).color, fs: parseFloat(getComputedStyle(leaf).fontSize), fw: parseInt(getComputedStyle(leaf).fontWeight, 10) || 400, layers: eff(el), text: (leaf.textContent || '').trim().slice(0, 28) };
    }, h);
    if (!m) continue;
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = m.layers.length - 1; i >= 0; i--) { const L = parse(m.layers[i]); if (L) bg = over(L, bg); }
    const fg = parse(m.fg); if (!fg) continue;
    const eff = over(fg, bg); const rt = ratio(eff, bg);
    const large = m.fs >= 24 || (m.fs >= 18.66 && m.fw >= 700); const need = large ? 3 : 4.5;
    const flag = rt < need ? ' <<< FAIL' : '';
    if (rt < need) F('P1', 'hover text contrast fails', `${h} ${rt.toFixed(2)} need ${need} ${m.fg} «${m.text}»`);
    hoverContrast.push(`${h}: ${rt.toFixed(2)} (need ${need}) «${m.text}»${flag}`);
  }
  await page.mouse.move(0, 0);
  console.log('--- HOVER CONTRAST'); hoverContrast.forEach(l => console.log('  ' + l));

  /* ---------- 4. MEGA MENUS: all three, fit + overflow + contrast ---------- */
  console.log('--- MEGA MENUS');
  const megaCount = await page.evaluate(() => document.querySelectorAll('.nav-item').length);
  for (let i = 0; i < megaCount; i++) {
    const info = await page.evaluate(async idx => {
      const items = document.querySelectorAll('.nav-item');
      document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('open'));
      const it = items[idx];
      const btn = it.querySelector('.nav-link');
      if (!it.querySelector('.mega')) return { idx, skip: true, label: (btn.textContent || '').trim() };
      it.classList.add('open');
      await new Promise(r => setTimeout(r, 320));
      const mega = it.querySelector('.mega');
      const mb = mega.getBoundingClientRect();
      const links = [...mega.querySelectorAll('a')];
      const over = links.filter(a => { const b = a.getBoundingClientRect(); return b.right > mb.right + 0.6 || b.left < mb.left - 0.6 || b.bottom > mb.bottom + 0.6; }).map(a => (a.textContent || '').trim().slice(0, 24));
      const tightPad = links.map(a => { const b = a.getBoundingClientRect(); const sp = a.querySelector('span'); if (!sp) return null; const sb = sp.getBoundingClientRect(); const gap = b.right - sb.right; return gap < 8 ? { t: (a.querySelector('b') || {}).textContent, gap: +gap.toFixed(1) } : null; }).filter(Boolean);
      const cols = getComputedStyle(mega).gridTemplateColumns;
      const vpFits = mb.left >= -1 && mb.right <= document.documentElement.clientWidth + 1;
      return { idx, label: (btn.textContent || '').trim(), w: Math.round(mb.width), cols, links: links.length, over, tightPad, vpFits, panelH: Math.round(mb.height) };
    }, i);
    if (info.skip) { console.log(`  [${info.label}] no mega (plain link)`); continue; }
    console.log(`  [${info.label}] w=${info.w} links=${info.links} cols=${info.cols} fitsVP=${info.vpFits}`);
    if (info.over.length) F('P1', 'mega menu link overflows its panel', `[${info.label}] ${info.over.join(' · ')}`);
    if (!info.vpFits) F('P1', 'mega menu leaves the viewport', `[${info.label}] w=${info.w}`);
    if (info.tightPad.length) F('P2', 'mega link text too close to its hover border', `[${info.label}] ${info.tightPad.map(x => `${x.t}:${x.gap}px`).join(' · ')}`);
  }
  await page.evaluate(() => document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('open')));

  /* ---------- 5. FIXED-ELEMENT COLLISIONS ---------- */
  const fixed = await page.evaluate(() => {
    const sel = ['.to-top', '.asst-btn', '.asst-panel', '.sticky-cta', '.consent', '.toast-host'];
    const out = [];
    document.querySelectorAll(sel.join(',')).forEach(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      out.push({ cls: el.className, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
    });
    const overlaps = [];
    for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
      const a = out[i], b = out[j];
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 4 && oy > 4) overlaps.push(`${a.cls} ∩ ${b.cls} (${ox}×${oy})`);
    }
    return { out, overlaps };
  });
  console.log('--- FIXED LAYERS'); fixed.out.forEach(o => console.log(`  ${o.cls.split(' ')[0]} @${o.x},${o.y} ${o.w}×${o.h}`));
  fixed.overlaps.forEach(o => F('P1', 'fixed elements overlap', o));
  // to-top and assistant should not collide on mobile either
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 400));
  const mob = await page.evaluate(() => {
    const t = document.querySelector('.to-top'), a = document.querySelector('.asst-btn'), s = document.querySelector('.sticky-cta');
    const g = el => { if (!el) return null; const cs = getComputedStyle(el); if (cs.display === 'none') return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };
    return { toTop: g(t), asst: g(a), sticky: g(s) };
  });
  console.log('--- MOBILE FIXED ' + JSON.stringify(mob));
  if (mob.toTop && mob.asst) { const dy = Math.abs((mob.toTop.y + mob.toTop.h) - mob.asst.y); if (mob.toTop.y + mob.toTop.h > mob.asst.y + 4) F('P1', 'mobile: back-to-top overlaps the assistant bubble', `toTop bottom=${mob.toTop.y + mob.toTop.h} asst top=${mob.asst.y}`); }
  if (mob.sticky && mob.asst) { const sb = mob.sticky.y; if (mob.asst.y + mob.asst.h > sb + 2) F('P2', 'mobile: assistant bubble sits under the sticky CTA', `asst bottom=${mob.asst.y + mob.asst.h} sticky top=${sb}`); }
  await page.setViewport({ width: 1440, height: 900 });

  /* ---------- 6. INTERACTIVE STATES (accordion, tabs, calculator, toggle, forms) ---------- */
  console.log('--- INTERACTIONS');
  const inter = await page.evaluate(async () => {
    const out = {};
    // FAQ accordion
    const q = document.querySelector('.faq-q');
    if (q) {
      const item = q.closest('.faq-item');
      const before = item.classList.contains('open');
      q.click(); await new Promise(r => setTimeout(r, 420));
      const after = item.classList.contains('open');
      const a = item.querySelector('.faq-a');
      out.faq = { toggled: before !== after, aria: q.getAttribute('aria-expanded'), answerH: a ? Math.round(a.getBoundingClientRect().height) : null };
    }
    // transcript tabs
    const tabs = [...document.querySelectorAll('.demo-tab')];
    if (tabs.length > 1) {
      const body = document.querySelector('.demo-body');
      const t0 = body ? body.innerText.slice(0, 40) : '';
      tabs[1].click(); await new Promise(r => setTimeout(r, 500));
      out.tabs = { n: tabs.length, changed: (body ? body.innerText.slice(0, 40) : '') !== t0, selected: tabs.filter(t => t.getAttribute('aria-selected') === 'true').length };
    }
    // pricing annual toggle
    const sw = document.querySelector('[data-annual]');
    if (sw) {
      const p = document.querySelector('[data-price-m]');
      const before = p ? p.textContent.trim() : '';
      sw.click(); await new Promise(r => setTimeout(r, 300));
      out.toggle = { changed: (p ? p.textContent.trim() : '') !== before, before, after: p ? p.textContent.trim() : '' };
    }
    // calculator
    const rng = document.querySelector('[data-calc] input[type=range]');
    if (rng) {
      const outEl = document.querySelector('[data-calc-out]');
      const before = outEl ? outEl.textContent.trim() : '';
      rng.value = String(Math.min(Number(rng.max), Number(rng.value) + 5));
      rng.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 200));
      out.toggleCalc = { changed: (outEl ? outEl.textContent.trim() : '') !== before, before, after: outEl ? outEl.textContent.trim() : '' };
    }
    // trade picker
    const chip = document.querySelectorAll('.trade-chip')[1];
    if (chip) {
      const line = document.querySelector('[data-trade-line]');
      const before = line ? line.innerText.slice(0, 30) : '';
      chip.click(); await new Promise(r => setTimeout(r, 350));
      const pressed = [...document.querySelectorAll('.trade-chip')].filter(c => c.getAttribute('aria-pressed') === 'true').length;
      out.trade = { changed: (line ? line.innerText.slice(0, 30) : '') !== before, pressedCount: pressed };
    }
    // motion toggle presence
    out.motionToggle = !!document.querySelector('[data-motion-toggle]');
    out.assistantBtn = !!document.getElementById('asst-btn');
    out.consent = !!document.getElementById('consent');
    out.exitModal = !!document.getElementById('exit-modal');
    out.toTop = !!document.getElementById('to-top');
    return out;
  });
  console.log('  ' + JSON.stringify(inter, null, 0));
  if (inter.faq && !inter.faq.toggled) F('P1', 'FAQ accordion does not toggle', JSON.stringify(inter.faq));
  if (inter.faq && inter.faq.aria !== 'true') F('P2', 'FAQ button aria-expanded not updated', String(inter.faq.aria));
  if (inter.faq && !inter.faq.answerH) F('P1', 'FAQ answer has zero height when open', String(inter.faq.answerH));
  if (inter.tabs && !inter.tabs.changed) F('P1', 'transcript tabs do not change content', JSON.stringify(inter.tabs));
  if (inter.tabs && inter.tabs.selected !== 1) F('P2', 'transcript tabs: expected exactly 1 selected', String(inter.tabs.selected));
  if (inter.toggle && !inter.toggle.changed) F('P1', 'annual pricing toggle does nothing', JSON.stringify(inter.toggle));
  if (inter.toggleCalc && !inter.toggleCalc.changed) F('P1', 'calculator output does not update', JSON.stringify(inter.toggleCalc));
  if (inter.trade && !inter.trade.changed) F('P1', 'trade picker does not update the preview', JSON.stringify(inter.trade));
  if (inter.trade && inter.trade.pressedCount !== 1) F('P2', 'trade picker: expected exactly 1 pressed chip', String(inter.trade.pressedCount));

  /* ---------- 7. ASSISTANT PANEL + CONSENT + MODAL states ---------- */
  const overlay = await page.evaluate(async () => {
    const out = {};
    const btn = document.getElementById('asst-btn'), panel = document.getElementById('asst-panel');
    if (btn && panel) {
      btn.click(); await new Promise(r => setTimeout(r, 400));
      const r = panel.getBoundingClientRect(), cs = getComputedStyle(panel);
      out.assistant = { open: panel.classList.contains('open'), visible: cs.visibility, w: Math.round(r.width), h: Math.round(r.height), insideVP: r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1, aria: btn.getAttribute('aria-expanded') };
      btn.click(); await new Promise(r => setTimeout(r, 250));
    }
    const consent = document.getElementById('consent');
    if (consent) {
      consent.hidden = false; await new Promise(r => setTimeout(r, 200));
      const r = consent.getBoundingClientRect();
      out.consent = { w: Math.round(r.width), h: Math.round(r.height), insideVP: r.left >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 };
      // does it cover the sticky CTA / assistant?
      const a = document.getElementById('asst-btn') ? document.getElementById('asst-btn').getBoundingClientRect() : null;
      if (a) out.consentCoversAssistant = r.bottom > a.top && r.right > a.left;
      consent.hidden = true;
    }
    return out;
  });
  console.log('--- OVERLAYS ' + JSON.stringify(overlay));
  if (overlay.assistant && !overlay.assistant.insideVP) F('P1', 'assistant panel opens outside the viewport', JSON.stringify(overlay.assistant));
  if (overlay.assistant && !overlay.assistant.open) F('P1', 'assistant panel does not open', JSON.stringify(overlay.assistant));
  if (overlay.consent && !overlay.consent.insideVP) F('P1', 'consent banner is outside the viewport', JSON.stringify(overlay.consent));

  /* ---------- 8. TYPE / SPACING NITS ---------- */
  const nits = await page.evaluate(() => {
    const out = { longLine: [], tightLH: [], monoBody: [] };
    document.querySelectorAll('p,li').forEach(el => {
      const t = (el.textContent || '').trim(); if (t.length < 60) return;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      // measure characters per line from the box
      const w = el.getBoundingClientRect().width;
      const chW = fs * 0.5;
      const cpl = Math.round(w / chW);
      if (cpl > 95 && !el.closest('.footer')) out.longLine.push(`${cpl}ch ${el.tagName}.${String(el.className).split(' ')[0]} «${t.slice(0, 30)}»`);
      if (parseFloat(cs.lineHeight) / fs < 1.4 && t.length > 120) out.tightLH.push(`${(parseFloat(cs.lineHeight) / fs).toFixed(2)} ${el.tagName}.${String(el.className).split(' ')[0]}`);
    });
    return out;
  });
  console.log('--- TYPE NITS'); if (!nits.longLine.length && !nits.tightLH.length) console.log('  none');
  [...new Set(nits.longLine)].slice(0, 8).forEach(x => { console.log('  long line: ' + x); F('P2', 'body line too long for comfort', x); });
  [...new Set(nits.tightLH)].slice(0, 5).forEach(x => F('P2', 'paragraph line-height under 1.4', x));

  /* ---------- 9. CONSOLE ---------- */
  [...new Set(errs)].forEach(e => F('P0', 'console/page error on home', e));

  await browser.close();
  const order = { P0: 0, P1: 1, P2: 2 };
  findings.sort((a, b) => order[a.sev] - order[b.sev]);
  console.log(`\n=== HOME AUDIT FINDINGS  P0=${findings.filter(f => f.sev === 'P0').length}  P1=${findings.filter(f => f.sev === 'P1').length}  P2=${findings.filter(f => f.sev === 'P2').length}`);
  findings.forEach(f => console.log(`${f.sev}  ${f.what} — ${f.detail}`));
  if (!findings.length) console.log('CLEAN');
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(2); });
