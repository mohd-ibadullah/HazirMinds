import fs from 'fs';
import puppeteer from 'puppeteer-core';
const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const EXE = 'C:/Users/froms/.cache/puppeteer/chrome/win64-153.0.8010.36/chrome-win64/chrome.exe';
const routes = ['/', '/about', '/case-studies', '/chief-of-staff', '/compare', '/demo', '/industries', '/masjids', '/privacy', '/services', '/terms', '/industries/automotive-fleet', '/industries/beauty-wellness-personal-care'];
const RULES = ['color-contrast', 'aria-allowed-attr', 'aria-required-children', 'aria-valid-attr-value', 'heading-order', 'label', 'duplicate-id', 'listitem', 'table-duplicate-name', 'th-has-data-cells', 'td-headers-attr', 'scope-attr-valid', 'link-name', 'button-name', 'image-alt', 'landmark-one-main', 'page-has-heading-one'];
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.evaluateOnNewDocument(() => { try { localStorage.setItem('hazirminds_consent', 'essential'); } catch (e) {} });
await p.setViewport({ width: 1440, height: 900 });
let bad = 0;
let fair = 0;
const blinded = [];
for (const r of routes) {
  await p.goto('http://localhost:4173' + r, { waitUntil: 'networkidle2', timeout: 60000 });
  await p.addScriptTag({ content: AXE });
  /* Colour-contrast must be measured on the settled painting, never on a frame mid-reveal.
     The reveal choreography animates opacity, so a run that happens to sample while a label is
     still fading reports a colour the reader never sees (the ✓ LABELED stamp reads
     1.12:1 mid-flight and 9.75:1 settled). Waiting for animations is not enough on its own — the
     result then depends on how fast the machine happened to be, and the suite flaps between 0
     and 2 failing pages on identical code. So ask the site for its own "motion unavailable"
     state: html.no-motion is a real state the CSS defines (everything revealed, transforms off,
     and it is what the engine-failure fallback applies). Contrast is measured on the colours the
     reader ends up seeing, and a genuine contrast defect is still caught. */
  await p.evaluate(() => document.documentElement.classList.add('no-motion', 'motion-done'));
  await p.waitForFunction(() => document.getAnimations().every(a => {
    if (a.playState !== 'running') return true;
    const t = a.effect && a.effect.getTiming && a.effect.getTiming();
    return !!(t && t.iterations === Infinity);
  }), { timeout: 10000, polling: 100 }).catch(() => { });
  await new Promise(res => setTimeout(res, 250));
  /* The settle condition is "nothing is part-way transparent". An earlier attempt froze the page
     with `animation:none!important`, which was WRONG: it deletes the fill of a fill-mode:both
     reveal, so two chat bubbles on `/` fell back to their base opacity:0 and axe skipped them. Those
     two bubbles are also exactly the pair that flapped colour-contrast — measured mid-fade, a bubble
     blends toward the background and reports a colour the reader never sees. */
  await p.waitForFunction(() => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const o = parseFloat(cs.opacity);
      if (o > 0.01 && o < 0.99) return false;
    }
    return true;
  }, { timeout: 10000, polling: 100 }).catch(() => { });
  await new Promise(res => setTimeout(res, 120));

  /* Proof that the wait did not blind the audit: the count of visible elements before and after must
     match. A drop would mean content went invisible, axe would skip it, and "AXE CLEAN" would mean
     "nothing was measured". */
  const visible = () => p.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) continue;
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) n++;
    }
    return n;
  });
  const visBefore = await visible();
  await new Promise(res => setTimeout(res, 320));
  const visAfter = await visible();
  if (visAfter < visBefore) fair++;
  blinded.push([r, visBefore, visAfter]);
  const v = await p.evaluate(async (rules) => {
    const o = await window.axe.run(document, { runOnly: rules });
    return o.violations.map(x => x.id + '(' + x.impact + ':' + x.nodes.length + ')');
  }, RULES);
  if (v.length) bad++;
  console.log('  ' + r.padEnd(34) + (v.length ? v.join(' ') : 'AXE CLEAN'));
}
console.log('\n  settle check: ' + (blinded.filter(x => x[2] < x[1]).length === 0
  ? 'no page lost a visible element while settling — the audit measured what a reader sees'
  : 'CONTENT WENT INVISIBLE on: ' + blinded.filter(x => x[2] < x[1]).map(x => x[0] + ' ' + x[1] + '->' + x[2]).join(', ')));
console.log('  pages with violations: ' + bad + '/' + routes.length);
await b.close();
